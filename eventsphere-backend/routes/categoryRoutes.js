const express = require("express");
const router = express.Router();
const { getAllCategories, createCategory, deleteCategory, getAllTags, createTag, deleteTag } = require("../controllers/categoryController");
const { verifyToken } = require("../middleware/authMiddleware");
const { checkRole } = require("../middleware/rbacMiddleware");

router.get("/categories", getAllCategories);
router.post("/categories", verifyToken, checkRole(['admin', 'superadmin']), createCategory);
router.delete("/categories/:id", verifyToken, checkRole(['superadmin']), deleteCategory);

router.get("/tags", getAllTags);
router.post("/tags", verifyToken, checkRole(['admin', 'superadmin']), createTag);
router.delete("/tags/:id", verifyToken, checkRole(['superadmin']), deleteTag);

module.exports = router;