const express = require("express");
const router = express.Router();
const { getAllUsers, updateUserRole, blockUser, deleteUser, getAdminStats, getAllEvents, updateEventStatus, getActivityLogs } = require("../controllers/adminController");
const { verifyToken } = require("../middleware/authMiddleware");
const { checkRole } = require("../middleware/rbacMiddleware");

router.get("/test", (req, res) => {
  res.json({ message: "Admin routes working" });
});

router.get("/test-users", async (req, res) => {
  try {
    const pool = require("../db");
    const result = await pool.query("SELECT id, name, email, role FROM users LIMIT 5");
    res.json({ users: result.rows, count: result.rows.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/test-role-update/:id", async (req, res) => {
  try {
    const pool = require("../db");
    const { id } = req.params;
    const result = await pool.query("SELECT id, name, email, role FROM users WHERE id = $1", [id]);
    res.json({ user: result.rows[0] || null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/stats", verifyToken, checkRole(['admin', 'superadmin']), getAdminStats);
router.get("/users", verifyToken, checkRole(['admin', 'superadmin']), getAllUsers);
router.put("/users/:id/role", verifyToken, checkRole(['superadmin']), updateUserRole);
router.put("/users/:id/block", verifyToken, checkRole(['admin', 'superadmin']), blockUser);
router.delete("/users/:id", verifyToken, checkRole(['superadmin']), deleteUser);

router.get("/events", verifyToken, checkRole(['superadmin']), getAllEvents);
router.put("/events/:id/status", verifyToken, checkRole(['superadmin']), updateEventStatus);
router.get("/activities", verifyToken, checkRole(['superadmin']), getActivityLogs);

module.exports = router;