const pool = require("../db");

exports.getAllCategories = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY name");
    res.json({ categories: result.rows });
  } catch (err) {
    console.error("Get categories error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await pool.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING *",
      [name]
    );
    
    try {
      await pool.query(
        "INSERT INTO activity_logs (user_id, activity_type, description, created_at) VALUES ($1, $2, $3, NOW())",
        [req.user.id, 'category_created', `Created category: ${name}`]
      );
    } catch (logError) {
      
    }
    
    res.status(201).json({ category: result.rows[0] });
  } catch (err) {
    console.error("Create category error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllTags = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tags ORDER BY name");
    res.json({ tags: result.rows });
  } catch (err) {
    console.error("Get tags error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await pool.query(
      "INSERT INTO tags (name) VALUES ($1) RETURNING *",
      [name]
    );
    
    try {
      await pool.query(
        "INSERT INTO activity_logs (user_id, activity_type, description, created_at) VALUES ($1, $2, $3, NOW())",
        [req.user.id, 'tag_created', `Created tag: ${name}`]
      );
    } catch (logError) {
      
    }
    
    res.status(201).json({ tag: result.rows[0] });
  } catch (err) {
    console.error("Create tag error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const categoryResult = await pool.query(
      "SELECT name FROM categories WHERE id = $1",
      [id]
    );
    
    if (categoryResult.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    const categoryName = categoryResult.rows[0].name;
    
    const eventCheck = await pool.query(
      "SELECT COUNT(*) FROM events WHERE category_id = $1",
      [id]
    );
    
    if (parseInt(eventCheck.rows[0].count) > 0) {
      return res.status(400).json({ error: "Cannot delete category that is being used by events" });
    }
    
    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [id]
    );
    
    try {
      await pool.query(
        "INSERT INTO activity_logs (user_id, activity_type, description, created_at) VALUES ($1, $2, $3, NOW())",
        [req.user.id, 'category_deleted', `Deleted category: ${categoryName}`]
      );
    } catch (logError) {
      
    }
    
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Delete category error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tagResult = await pool.query(
      "SELECT name FROM tags WHERE id = $1",
      [id]
    );
    
    if (tagResult.rows.length === 0) {
      return res.status(404).json({ error: "Tag not found" });
    }
    
    const tagName = tagResult.rows[0].name;
    
    const eventCheck = await pool.query(
      "SELECT COUNT(*) FROM event_tags WHERE tag_id = $1",
      [id]
    );
    
    if (parseInt(eventCheck.rows[0].count) > 0) {
      return res.status(400).json({ error: "Cannot delete tag that is being used by events" });
    }
    
    const result = await pool.query(
      "DELETE FROM tags WHERE id = $1 RETURNING *",
      [id]
    );
    
    try {
      await pool.query(
        "INSERT INTO activity_logs (user_id, activity_type, description, created_at) VALUES ($1, $2, $3, NOW())",
        [req.user.id, 'tag_deleted', `Deleted tag: ${tagName}`]
      );
    } catch (logError) {
      
    }
    
    res.json({ message: "Tag deleted successfully" });
  } catch (err) {
    console.error("Delete tag error:", err);
    res.status(500).json({ error: "Server error" });
  }
};