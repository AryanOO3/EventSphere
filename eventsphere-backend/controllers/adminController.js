let poolCache = null;
const getPool = async () => {
  if (!poolCache) {
    const db = await import("../db.js");
    poolCache = db.default || db;
  }
  return poolCache;
};

exports.getAllUsers = async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.query(
      "SELECT id, name, email, role, is_blocked, created_at FROM users ORDER BY id DESC"
    );
    
    const users = result.rows.map(user => ({
      ...user,
      is_active: !user.is_blocked
    }));
    res.json({ users });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ error: `Server error: ${err.message}` });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const pool = await getPool();
    const { id } = req.params;
    const { role } = req.body;
    
    console.log(`Updating user ${id} role to ${role}`);
    
    if (!['user', 'admin', 'superadmin'].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }
    
    // First check if user exists
    const userCheck = await pool.query("SELECT id, role FROM users WHERE id = $1", [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    console.log(`User ${id} current role: ${userCheck.rows[0].role}, updating to: ${role}`);
    
    const result = await pool.query(
      "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role",
      [role, id]
    );
    
    console.log(`Update result:`, result.rows[0]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ user: result.rows[0], message: "User role updated successfully" });
  } catch (err) {
    console.error("Update user role error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const pool = await getPool();
    const { id } = req.params;
    const { is_blocked } = req.body;
    
    const result = await pool.query(
      "UPDATE users SET is_blocked = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, email, is_blocked",
      [is_blocked, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ user: result.rows[0], message: `User ${is_blocked ? 'blocked' : 'unblocked'} successfully` });
  } catch (err) {
    console.error("Block user error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const pool = await getPool();
    const { id } = req.params;
    const currentUserId = req.user.id;
    
    if (parseInt(id) === currentUserId) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }
    
    try {
      await pool.query("DELETE FROM registrations WHERE user_id = $1", [id]);
    } catch (regError) {
      
    }
    
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const pool = await getPool();
    const usersResult = await pool.query("SELECT COUNT(*) as total_users FROM users");
    const activeEventsResult = await pool.query("SELECT COUNT(*) as active_events FROM events WHERE date >= CURRENT_DATE");
    const completedEventsResult = await pool.query("SELECT COUNT(*) as completed_events FROM events WHERE date < CURRENT_DATE");
    const totalEventsResult = await pool.query("SELECT COUNT(*) as total_events FROM events");
    
    let rsvpsResult;
    try {
      rsvpsResult = await pool.query("SELECT COUNT(*) as total_rsvps, COUNT(CASE WHEN status = 'yes' THEN 1 END) as going_count FROM rsvps");
    } catch (rsvpError) {
      rsvpsResult = { rows: [{ total_rsvps: 0, going_count: 0 }] };
    }
    
    const stats = {
      totalUsers: parseInt(usersResult.rows[0].total_users),
      activeEvents: parseInt(activeEventsResult.rows[0].active_events),
      completedEvents: parseInt(completedEventsResult.rows[0].completed_events),
      totalEvents: parseInt(totalEventsResult.rows[0].total_events),
      totalRsvps: parseInt(rsvpsResult.rows[0].total_rsvps),
      goingCount: parseInt(rsvpsResult.rows[0].going_count)
    };
    
    res.json({ stats });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.query(
      "SELECT e.*, u.name as organizer_name, c.name as category_name FROM events e LEFT JOIN users u ON e.organizer_id = u.id LEFT JOIN categories c ON e.category_id = c.id ORDER BY e.created_at DESC"
    );
    res.json({ events: result.rows });
  } catch (err) {
    console.error("Get all events error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateEventStatus = async (req, res) => {
  try {
    const pool = await getPool();
    const { id } = req.params;
    const { is_published } = req.body;
    
    const result = await pool.query(
      "UPDATE events SET is_published = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [is_published, id]
    );
    
    res.json({ event: result.rows[0], message: "Event status updated" });
  } catch (err) {
    console.error("Update event status error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getActivityLogs = async (req, res) => {
  try {
    const pool = await getPool();
    let rsvpLogs = { rows: [] };
    try {
      rsvpLogs = await pool.query(
        "SELECT r.*, u.name as user_name, e.title as event_title FROM rsvps r JOIN users u ON r.user_id = u.id JOIN events e ON r.event_id = e.id ORDER BY r.created_at DESC LIMIT 50"
      );
    } catch (rsvpError) {
      
    }
    
    const userLogs = await pool.query(
      "SELECT id, name, email, role, created_at, 'user_registration' as activity_type FROM users ORDER BY created_at DESC LIMIT 50"
    );
    
    let activityLogs = { rows: [] };
    try {
      activityLogs = await pool.query(
        "SELECT al.id, al.user_id, al.activity_type, al.description, al.created_at, u.name as user_name FROM activity_logs al JOIN users u ON al.user_id = u.id ORDER BY al.created_at DESC LIMIT 50"
      );
    } catch (activityError) {
      
    }
    
    const activities = [
      ...rsvpLogs.rows.map(r => ({ ...r, activity_type: 'rsvp' })),
      ...userLogs.rows,
      ...activityLogs.rows
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 100);
    
    res.json({ activities });
  } catch (err) {
    console.error("Get activity logs error:", err);
    res.status(500).json({ error: "Server error" });
  }
};