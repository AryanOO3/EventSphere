const pool = require("../db");

exports.getAllEvents = async (req, res) => {
  try {
    const { category, tags } = req.query;
    let query = `
      SELECT e.*, c.name as category_name, 
             ARRAY_AGG(t.name) FILTER (WHERE t.name IS NOT NULL) as tags,
             COUNT(CASE WHEN r.status = 'yes' THEN 1 END) as going_count,
             COUNT(CASE WHEN r.status = 'no' THEN 1 END) as not_going_count
      FROM events e
      LEFT JOIN categories c ON e.category_id = c.id
      LEFT JOIN event_tags et ON e.id = et.event_id
      LEFT JOIN tags t ON et.tag_id = t.id
      LEFT JOIN rsvps r ON e.id = r.event_id
      WHERE e.is_published = true
    `;
    const params = [];
    
    if (category) {
      query += ` AND c.name = $${params.length + 1}`;
      params.push(category);
    }
    
    if (tags) {
      const tagArray = tags.split(',');
      query += ` AND EXISTS (
        SELECT 1 FROM event_tags et2 
        JOIN tags t2 ON et2.tag_id = t2.id 
        WHERE et2.event_id = e.id AND t2.name = ANY($${params.length + 1})
      )`;
      params.push(tagArray);
    }
    
    query += ` GROUP BY e.id, c.name ORDER BY e.date`;
    
    const result = await pool.query(query, params);
    
    for (let event of result.rows) {
      try {
        const filesResult = await pool.query(
          "SELECT filename, original_name, file_path, file_type FROM event_files WHERE event_id = $1",
          [event.id]
        );
        event.files = filesResult.rows.filter(f => f.file_type !== 'image/cover');
        
        const coverFile = filesResult.rows.find(f => f.file_type === 'image/cover');
        if (coverFile) {
          event.cover_image = coverFile.file_path;
        }
      } catch (fileError) {
        event.files = [];
      }
    }
    
    res.json({ events: result.rows });
  } catch (err) {
    console.error("Get events error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT e.*, u.name as organizer_name, c.name as category_name FROM events e LEFT JOIN users u ON e.organizer_id = u.id LEFT JOIN categories c ON e.category_id = c.id WHERE e.id = $1 AND e.is_published = true",
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    const event = result.rows[0];
    
    const tagsResult = await pool.query(
      "SELECT t.name FROM event_tags et JOIN tags t ON et.tag_id = t.id WHERE et.event_id = $1",
      [id]
    );
    event.tags = tagsResult.rows.map(row => row.name);
    
    try {
      const filesResult = await pool.query(
        "SELECT filename, original_name, file_path, file_type FROM event_files WHERE event_id = $1",
        [id]
      );
      event.files = filesResult.rows.filter(f => f.file_type !== 'image/cover');
      
      const coverFile = filesResult.rows.find(f => f.file_type === 'image/cover');
      if (coverFile) {
        event.cover_image = coverFile.file_path;
      }
    } catch (fileError) {
      event.files = [];
    }
    
    res.json({ event });
  } catch (err) {
    console.error("Get event error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, location, date, time, category_id, rsvp_limit, is_published } = req.body;
    const tags = req.body.tags ? JSON.parse(req.body.tags) : [];
    const organizerId = req.user.id;
    
    const coverImage = req.files && req.files.cover_image ? `/uploads/covers/${req.files.cover_image[0].filename}` : null;
    
    let result;
    try {
      result = await pool.query(
        "INSERT INTO events (title, description, location, date, time, organizer_id, category_id, rsvp_limit, cover_image, is_published) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
        [title, description, location, date, time, organizerId, category_id || null, rsvp_limit || null, coverImage, is_published || false]
      );
    } catch (columnError) {
      result = await pool.query(
        "INSERT INTO events (title, description, location, date, organizer_id, category_id, is_published) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [title, description, location, date, organizerId, category_id || null, is_published || false]
      );
    }
    
    const eventId = result.rows[0].id;
    
    if (req.files && req.files.cover_image) {
      try {
        await pool.query(
          "INSERT INTO event_files (event_id, filename, original_name, file_path, file_type, uploaded_by) VALUES ($1, $2, $3, $4, $5, $6)",
          [eventId, req.files.cover_image[0].filename, req.files.cover_image[0].originalname, coverImage, 'image/cover', organizerId]
        );
      } catch (fileError) {
        
      }
    }
    
    if (req.files && req.files.event_files) {
      for (const file of req.files.event_files) {
        try {
          await pool.query(
            "INSERT INTO event_files (event_id, filename, original_name, file_path, file_type, uploaded_by) VALUES ($1, $2, $3, $4, $5, $6)",
            [eventId, file.filename, file.originalname, `/uploads/files/${file.filename}`, file.mimetype, organizerId]
          );
        } catch (fileError) {
          
        }
      }
    }
    
    if (tags && tags.length > 0) {
      for (const tagId of tags) {
        try {
          await pool.query(
            "INSERT INTO event_tags (event_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [eventId, tagId]
          );
        } catch (tagError) {
          
        }
      }
    }
    
    try {
      await pool.query(
        "INSERT INTO activity_logs (user_id, activity_type, description, created_at) VALUES ($1, $2, $3, NOW())",
        [organizerId, 'event_created', `Created event: ${title}`]
      );
    } catch (logError) {
      
    }
    
    res.status(201).json({ event: result.rows[0], message: "Event created successfully" });
  } catch (err) {
    console.error("Create event error:", err);
    res.status(500).json({ error: `Server error: ${err.message}` });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, date, time, category_id, rsvp_limit, is_published } = req.body;



    const tags = req.body.tags ? JSON.parse(req.body.tags) : [];
    const userId = req.user.id;
    
    const checkResult = await pool.query(
      "SELECT organizer_id FROM events WHERE id = $1",
      [id]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    const event = checkResult.rows[0];
    if (parseInt(event.organizer_id) !== parseInt(userId) && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ error: "Not authorized to update this event" });
    }
    
    const coverImage = req.files && req.files.cover_image ? `/uploads/covers/${req.files.cover_image[0].filename}` : null;
    if (coverImage) {
      try {
        const oldEventResult = await pool.query("SELECT cover_image FROM events WHERE id = $1", [id]);
        if (oldEventResult.rows[0]?.cover_image) {
          const fs = require('fs');
          const path = require('path');
          const oldImagePath = path.join(__dirname, '..', oldEventResult.rows[0].cover_image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        
        await pool.query("DELETE FROM event_files WHERE event_id = $1 AND file_type = 'image/cover'", [id]);
      } catch (deleteError) {
        
      }
    }
    
    let result;
    try {
      result = await pool.query(
        "UPDATE events SET title = $1, description = $2, location = $3, date = $4 WHERE id = $5 RETURNING *",
        [title, description, location, date, id]
      );
    } catch (basicError) {
      throw basicError;
    }
    
    if (coverImage) {
      try {
        await pool.query(
          "INSERT INTO event_files (event_id, filename, original_name, file_path, file_type, uploaded_by) VALUES ($1, $2, $3, $4, $5, $6)",
          [id, req.files.cover_image[0].filename, 'cover_image', coverImage, 'image/cover', userId]
        );
      } catch (fileError) {
        
      }
    }
    
    if (req.files && req.files.event_files) {
      try {
        await pool.query("DELETE FROM event_files WHERE event_id = $1 AND file_type != 'image/cover'", [id]);
      } catch (fileError) {
        
      }
      
      for (const file of req.files.event_files) {
        try {
          await pool.query(
            "INSERT INTO event_files (event_id, filename, original_name, file_path, file_type, uploaded_by) VALUES ($1, $2, $3, $4, $5, $6)",
            [id, file.filename, file.originalname, `/uploads/files/${file.filename}`, file.mimetype, userId]
          );
        } catch (fileError) {
          
        }
      }
    }
    
    try {
      await pool.query("DELETE FROM event_tags WHERE event_id = $1", [id]);
      if (tags && tags.length > 0) {
        for (const tagId of tags) {
          await pool.query(
            "INSERT INTO event_tags (event_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [id, tagId]
          );
        }
      }
    } catch (tagError) {
      
    }
    
    try {
      await pool.query(
        "INSERT INTO activity_logs (user_id, activity_type, description, created_at) VALUES ($1, $2, $3, NOW())",
        [userId, 'event_updated', `Updated event: ${title}`]
      );
    } catch (logError) {
      
    }
    
    res.json({ event: result.rows[0], message: "Event updated successfully" });
  } catch (err) {
    console.error("Update event error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const checkResult = await pool.query(
      "SELECT organizer_id FROM events WHERE id = $1",
      [id]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    const event = checkResult.rows[0];
    if (event.organizer_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Not authorized to delete this event" });
    }
    
    try {
      const filesResult = await pool.query("SELECT file_path FROM event_files WHERE event_id = $1", [id]);
      const fs = require('fs');
      const path = require('path');
      
      for (const file of filesResult.rows) {
        const filePath = path.join(__dirname, '..', file.file_path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      
      const eventResult = await pool.query("SELECT cover_image FROM events WHERE id = $1", [id]);
      if (eventResult.rows[0]?.cover_image) {
        const coverPath = path.join(__dirname, '..', eventResult.rows[0].cover_image);
        if (fs.existsSync(coverPath)) {
          fs.unlinkSync(coverPath);
        }
      }
    } catch (fileDeleteError) {
      
    }
    
    const eventResult = await pool.query("SELECT title FROM events WHERE id = $1", [id]);
    const eventTitle = eventResult.rows[0]?.title || 'Unknown Event';
    
    await pool.query("DELETE FROM events WHERE id = $1", [id]);
    
    try {
      await pool.query(
        "INSERT INTO activity_logs (user_id, activity_type, description, created_at) VALUES ($1, $2, $3, NOW())",
        [userId, 'event_deleted', `Deleted event: ${eventTitle}`]
      );
    } catch (logError) {
      
    }
    
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Delete event error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.rsvpEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    
    if (!['yes', 'no'].includes(status)) {
      return res.status(400).json({ error: "Status must be 'yes' or 'no'" });
    }
    
    const eventCheck = await pool.query("SELECT id FROM events WHERE id = $1", [id]);
    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    const result = await pool.query(
      "INSERT INTO rsvps (user_id, event_id, status) VALUES ($1, $2, $3) ON CONFLICT (user_id, event_id) DO UPDATE SET status = $3, updated_at = NOW() RETURNING *",
      [userId, id, status]
    );
    
    let qrCode = null;
    if (status === 'yes') {
      try {
        const QRCode = require('qrcode');
        const qrData = JSON.stringify({ userId, eventId: id, timestamp: Date.now() });
        qrCode = await QRCode.toDataURL(qrData);
      } catch (qrError) {

      }
    }
    
    const eventResult = await pool.query("SELECT title FROM events WHERE id = $1", [id]);
    const eventTitle = eventResult.rows[0]?.title || 'Event';
    
    res.json({ rsvp: result.rows[0], qrCode, eventTitle, message: "RSVP updated successfully" });
  } catch (err) {
    console.error("RSVP error:", err);
    res.status(500).json({ error: `Server error: ${err.message}` });
  }
};

exports.getUserRsvp = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const result = await pool.query(
      "SELECT r.*, CASE WHEN c.id IS NOT NULL THEN true ELSE false END as is_checked_in FROM rsvps r LEFT JOIN check_ins c ON r.user_id = c.user_id AND r.event_id = c.event_id WHERE r.user_id = $1 AND r.event_id = $2",
      [userId, id]
    );
    
    res.json({ rsvp: result.rows[0] || null });
  } catch (err) {
    console.error("Get RSVP error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getEventRsvps = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if user is organizer or admin
    const eventCheck = await pool.query(
      "SELECT organizer_id FROM events WHERE id = $1",
      [id]
    );
    
    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    if (eventCheck.rows[0].organizer_id !== userId && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ error: "Not authorized" });
    }
    
    const result = await pool.query(
      "SELECT r.*, u.name, u.email, CASE WHEN c.id IS NOT NULL THEN true ELSE false END as is_checked_in FROM rsvps r JOIN users u ON r.user_id = u.id LEFT JOIN check_ins c ON r.user_id = c.user_id AND r.event_id = c.event_id WHERE r.event_id = $1 ORDER BY r.created_at DESC",
      [id]
    );
    
    res.json({ rsvps: result.rows });
  } catch (err) {
    console.error("Get event RSVPs error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.checkInUser = async (req, res) => {
  try {
    const { eventId, userId } = req.params;
    const checkedInBy = req.user.id;
    
    // Check if user is organizer or admin
    const eventCheck = await pool.query(
      "SELECT organizer_id FROM events WHERE id = $1",
      [eventId]
    );
    
    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    if (eventCheck.rows[0].organizer_id !== checkedInBy && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ error: "Not authorized" });
    }
    
    const result = await pool.query(
      "INSERT INTO check_ins (user_id, event_id, checked_in_by) VALUES ($1, $2, $3) ON CONFLICT (user_id, event_id) DO UPDATE SET checked_in_at = NOW() RETURNING *",
      [userId, eventId, checkedInBy]
    );
    
    res.json({ checkIn: result.rows[0], message: "User checked in successfully" });
  } catch (err) {
    console.error("Check in error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.uploadEventFiles = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    
    const uploadedFiles = [];
    for (const file of req.files) {
      const result = await pool.query(
        "INSERT INTO event_files (event_id, filename, original_name, file_path, file_type) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [parseInt(id), file.filename, file.originalname, `/uploads/files/${file.filename}`, file.mimetype]
      );
      uploadedFiles.push(result.rows[0]);
    }
    
    res.json({ 
      message: "Files uploaded successfully", 
      files: uploadedFiles 
    });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getEventAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const eventCheck = await pool.query(
      "SELECT organizer_id FROM events WHERE id = $1",
      [id]
    );
    
    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    if (eventCheck.rows[0].organizer_id !== userId && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ error: "Not authorized" });
    }
    
    const result = await pool.query(
      `SELECT 
        COUNT(CASE WHEN r.status = 'yes' THEN 1 END) as going,
        COUNT(CASE WHEN r.status = 'no' THEN 1 END) as not_going,
        COUNT(CASE WHEN c.id IS NOT NULL THEN 1 END) as checked_in
      FROM rsvps r 
      LEFT JOIN check_ins c ON r.user_id = c.user_id AND r.event_id = c.event_id 
      WHERE r.event_id = $1`,
      [id]
    );
    
    const stats = result.rows[0];
    res.json({ 
      going: parseInt(stats.going) || 0,
      notGoing: parseInt(stats.not_going) || 0,
      checkedIn: parseInt(stats.checked_in) || 0
    });
  } catch (err) {
    console.error("Get attendance error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteEventFile = async (req, res) => {
  try {
    const { eventId, filename } = req.params;
    const userId = req.user.id;
    
    const eventCheck = await pool.query(
      "SELECT organizer_id FROM events WHERE id = $1",
      [eventId]
    );
    
    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    if (eventCheck.rows[0].organizer_id !== userId && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ error: "Not authorized" });
    }
    
    const fileResult = await pool.query(
      "SELECT file_path FROM event_files WHERE event_id = $1 AND filename = $2",
      [eventId, filename]
    );
    
    if (fileResult.rows.length === 0) {
      return res.status(404).json({ error: "File not found" });
    }
    
    const filePath = fileResult.rows[0].file_path;
    
    // Delete from database
    await pool.query(
      "DELETE FROM event_files WHERE event_id = $1 AND filename = $2",
      [eventId, filename]
    );
    
    // Delete from filesystem
    try {
      const fs = require('fs');
      const path = require('path');
      const fullPath = path.join(__dirname, '..', filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (fsError) {

    }
    
    res.json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("Delete file error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUserDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(
      `SELECT 
        COUNT(CASE WHEN r.status = 'yes' THEN 1 END) as attending,
        COUNT(CASE WHEN c.id IS NOT NULL THEN 1 END) as attended
      FROM rsvps r 
      LEFT JOIN check_ins c ON r.user_id = c.user_id AND r.event_id = c.event_id 
      WHERE r.user_id = $1`,
      [userId]
    );
    
    const stats = result.rows[0];
    res.json({ 
      attending: parseInt(stats.attending) || 0,
      attended: parseInt(stats.attended) || 0
    });
  } catch (err) {
    console.error("Get user dashboard stats error:", err);
    res.status(500).json({ error: "Server error" });
  }
};