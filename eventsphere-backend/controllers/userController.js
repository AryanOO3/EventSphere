const pool = require("../db");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(
      "SELECT id, name, email, role, profile_picture, created_at FROM users WHERE id = $1",
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;
    
    const result = await pool.query(
      "UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, email, role, profile_picture",
      [name, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ user: result.rows[0], message: "Profile updated successfully" });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }
    
    const profilePicturePath = `/uploads/profiles/${req.file.filename}`;
    
    const result = await pool.query(
      "UPDATE users SET profile_picture = $1 WHERE id = $2 RETURNING id, name, email, role, profile_picture",
      [profilePicturePath, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ user: result.rows[0], message: "Profile picture updated successfully" });
  } catch (err) {
    console.error("Profile picture upload error:", err.message, err.stack);
    res.status(500).json({ error: `Server error: ${err.message}` });
  }
};