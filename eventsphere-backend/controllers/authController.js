// Load all required modules at startup - not lazy loaded
const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../utils/emailService");

// All modules loaded above this line at module initialization

// Constants
const SALT_ROUNDS = 10;

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  
  // Input validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
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
    if (err.code === '23505') { // PostgreSQL unique violation
      return res.status(400).json({ error: "Email already in use" });
    }
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  // Input validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  
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
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
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
      console.error("Database schema error:", columnError.message);
      return res.status(500).json({ 
        error: "Reset password functionality is not available. Please contact support.",
        note: "Database schema needs to be updated with reset token columns"
      });
    }

    // Always provide fallback URL regardless of email success/failure
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    try {
      await sendPasswordResetEmail(email, resetToken);
      res.json({ 
        message: "Password reset email sent. Check your inbox. If you don't receive it, use the button below.",
        resetUrl: resetUrl,
        emailSent: true
      });
    } catch (emailError) {
      console.error("Email service error:", emailError.message);
      res.json({ 
        message: "Email service temporarily unavailable. Use the reset button below:", 
        resetUrl: resetUrl,
        emailSent: false
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

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

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
    // Input validation
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "User authentication required" });
    }
    
    const userId = req.user.id;
    
    // Validate userId is a number
    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    
    const result = await pool.query(
      "UPDATE users SET last_login = NOW() WHERE id = $1",
      [userId]
    );
    
    // Check if user was actually updated
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ message: "Login time updated" });
  } catch (err) {
    console.error("Update last login error:", err);
    res.status(500).json({ error: "Failed to update login time" });
  }
};