const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../utils/emailService");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, profile_picture",
      [name, email, hashedPassword, "user"]
    );
    
    const token = jwt.sign({ id: result.rows[0].id, role: result.rows[0].role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    
    res.status(201).json({ 
      token,
      user: result.rows[0]
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(400).json({ error: "Email already in use or invalid data" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user || user.is_blocked) {
      return res.status(403).json({ error: "Access denied" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, profile_picture: user.profile_picture }
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Email already in use or invalid data" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);

    try {
      await pool.query(
        "UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3",
        [resetToken, resetTokenExpires, user.id]
      );
    } catch (columnError) {
      return res.json({ 
        message: "Password reset requested. Contact admin to reset your password.",
        note: "Reset token functionality requires database schema update"
      });
    }

    try {
      await sendPasswordResetEmail(email, resetToken);
      res.json({ message: "Password reset email sent. Check your inbox." });
    } catch (emailError) {
      res.json({ 
        message: "Email service not configured. Use this reset link:", 
        resetToken: resetToken,
        resetUrl: `http://localhost:3000/reset-password/${resetToken}`
      });
    }
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()",
      [token]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2",
      [hashedPassword, user.id]
    );

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateLastLogin = async (req, res) => {
  try {
    const userId = req.user.id;
    await pool.query(
      "UPDATE users SET last_login = NOW() WHERE id = $1",
      [userId]
    );
    res.json({ message: "Login time updated" });
  } catch (err) {

    res.status(200).json({ message: "Login time update skipped" });
  }
};