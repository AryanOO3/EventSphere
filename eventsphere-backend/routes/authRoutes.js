const express = require("express");
const router = express.Router();
const { register, login, forgotPassword, resetPassword, updateLastLogin } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/update-login", verifyToken, updateLastLogin);

module.exports = router;