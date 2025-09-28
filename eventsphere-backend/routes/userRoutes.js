const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, uploadProfilePicture } = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/rbacMiddleware");
const profileUpload = require("../middleware/profileUpload");

router.get("/profile", verifyToken, checkPermission('edit_profile'), getProfile);
router.put("/profile", verifyToken, checkPermission('edit_profile'), updateProfile);
router.post("/profile/picture", verifyToken, checkPermission('edit_profile'), profileUpload.single('profilePicture'), uploadProfilePicture);

module.exports = router;