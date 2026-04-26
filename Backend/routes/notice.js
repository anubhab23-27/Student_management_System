import express from "express";
import pool from "../db.js";

const router = express.Router();

// 📥 GET all notices (FOR YOUR FRONTEND)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM notices ORDER BY created_at DESC",
    );

    // 🔥 format for your UI
    const formatted = result.rows.map((n) => ({
      id: n.id,
      title: n.title,
      desc: n.content,
      tag: n.tag,
      date: new Date(n.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// ➕ ADD notice
router.post("/", async (req, res) => {
  try {
    const { title, content, tag } = req.body;

    // validation
    if (!title || !content) {
      return res.status(400).json({
        error: "Title and content are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO notices (title, content, tag)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, content, tag || "Update"],
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// ❌ DELETE notice by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM notices WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Notice not found",
      });
    }

    res.json({
      message: "Notice deleted successfully ✅",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
