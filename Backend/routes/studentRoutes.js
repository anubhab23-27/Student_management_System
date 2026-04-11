import express from "express";
import pool from "../db.js"; 

const router = express.Router();

// GET all students
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM students");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// DELETE student by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM students WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: "Student deleted successfully ✅" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/students?batch=CSE&sectionn=A

router.get("/filtered", async (req, res) => {
  try {
    const { batch, sectionn } = req.query;
    console.log("Query:", req.query);

    // ❗ validate required params
    if (!batch || !sectionn) {
      return res.status(400).json({
        error: "batch and sectionn are required",
      });
    }

    const query = `
      SELECT *
      FROM public.students
      WHERE batch = $1
      AND sectionn = $2
      ORDER BY id ASC
    `;

    const values = [batch, sectionn];

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET student by rollnumber
router.get("/by-roll/:roll", async (req, res) => {
  try {
    const { roll } = req.params;

    const result = await pool.query(
      `SELECT id, rollnumber, name 
       FROM students 
       WHERE rollnumber = $1`,
      [roll]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default router;
