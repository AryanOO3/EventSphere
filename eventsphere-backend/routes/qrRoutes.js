const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/rbacMiddleware");
const pool = require("../db");

router.get("/checkins/:eventId", verifyToken, checkPermission('manage_events'), async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const result = await pool.query(`
      SELECT c.*, u.name, u.email, c.checked_in_at,
             checker.name as checked_in_by_name
      FROM check_ins c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN users checker ON c.checked_in_by = checker.id
      WHERE c.event_id = $1
      ORDER BY c.checked_in_at DESC
    `, [eventId]);
    
    res.json({ checkIns: result.rows });
  } catch (err) {
    console.error("Get check-ins error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/checkin", verifyToken, checkPermission('manage_events'), async (req, res) => {
  try {
    const { qrData } = req.body;
    const checkedInBy = req.user.id;
    
    const { userId, eventId } = JSON.parse(qrData);
    
    const rsvpCheck = await pool.query(
      "SELECT * FROM rsvps WHERE user_id = $1 AND event_id = $2 AND status = 'yes'",
      [userId, eventId]
    );
    
    if (rsvpCheck.rows.length === 0) {
      return res.status(400).json({ error: "No valid RSVP found" });
    }
    
    const existingCheckIn = await pool.query(
      "SELECT * FROM check_ins WHERE user_id = $1 AND event_id = $2",
      [userId, eventId]
    );
    
    if (existingCheckIn.rows.length > 0) {
      const userResult = await pool.query(
        "SELECT name, email FROM users WHERE id = $1",
        [userId]
      );
      return res.status(400).json({ 
        error: "User already checked in",
        user: userResult.rows[0]
      });
    }
    
    const result = await pool.query(
      "INSERT INTO check_ins (user_id, event_id, checked_in_by) VALUES ($1, $2, $3) RETURNING *",
      [userId, eventId, checkedInBy]
    );
    
    const userResult = await pool.query(
      "SELECT name, email FROM users WHERE id = $1",
      [userId]
    );
    
    res.json({ 
      checkIn: result.rows[0], 
      user: userResult.rows[0],
      message: "User checked in successfully" 
    });
  } catch (err) {
    console.error("Check-in error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;