import express from "express";
import pool from "../db.js";

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const { date, batch, sectionn, attendance } = req.body;

    // 🔍 Validation
    if (!date || !batch || !sectionn || !attendance) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 🔁 Loop through each student
    for (let record of attendance) {
      const { student_id, rollnumber, present } = record;

      await pool.query(
        `
        INSERT INTO attendance 
        (student_id, rollnumber, date, present, batch, sectionn)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (student_id, date)
        DO UPDATE SET 
          present = EXCLUDED.present,
          rollnumber = EXCLUDED.rollnumber
        `,
        [student_id, rollnumber, date, present, batch, sectionn],
      );
    }

    res.json({ message: "Attendance saved successfully ✅" });
  } catch (err) {
    console.error("Error saving attendance:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { date, batch, sectionn } = req.query;

    const result = await pool.query(
      `
      SELECT 
        a.student_id,
        a.rollnumber,
        a.present
      FROM attendance a
      WHERE a.date = $1 AND a.batch = $2 AND a.sectionn = $3
      `,
      [date, batch, sectionn],
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// get mounthly report
router.get("/report", async (req, res) => {
  try {
    const { batch, sectionn, month } = req.query;

    if (!batch || !sectionn || !month) {
      return res.status(400).json({ error: "Missing params" });
    }

    const result = await pool.query(
      `
      SELECT 
        s.id,
        s.rollnumber,
        s.name,
        TO_CHAR(a.date, 'YYYY-MM-DD') as date,
        a.present
      FROM students s
      LEFT JOIN attendance a 
        ON s.id = a.student_id
        AND a.batch = $1
        AND a.sectionn = $2
        AND TO_CHAR(a.date, 'YYYY-MM') = $3
      WHERE s.batch = $1 
        AND s.sectionn = $2
      ORDER BY s.rollnumber, a.date
      `,
      [batch, sectionn, month],
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// GET Each student attendance(student dashboard)
// GET student attendance by month
router.get("/student/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { month } = req.query; // "2026-04"

    if (!month) {
      return res.status(400).json({ error: "Month is required" });
    }

    const result = await pool.query(
      `SELECT date, present 
       FROM attendance
       WHERE student_id = $1
       AND TO_CHAR(date, 'YYYY-MM') = $2
       ORDER BY date`,
      [id, month],
    );

    res.json({ attendance: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});





export default router;