import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      date,
      startTime,
      duration,
      semester,
      testNo,
      batch,
      sectionn,
      questions,
    } = req.body;

    await client.query("BEGIN");

    // ✅ 1. Insert exam
    const examResult = await client.query(
      `INSERT INTO exams 
      (date, start_time, duration, semester, test_no, batch, sectionn)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING id`,
      [date, startTime, duration, semester, testNo, batch, sectionn],
    );

    const examId = examResult.rows[0].id;

    // ✅ 2. Insert questions
    for (let q of questions) {
      await client.query(
        `INSERT INTO questions 
        (exam_id, question, options, correct_answer)
        VALUES ($1,$2,$3,$4)`,
        [
          examId,
          q.question,
          q.options, // PostgreSQL TEXT[]
          Number(q.correctAnswer),
        ],
      );
    }

    await client.query("COMMIT");

    res.json({
      message: "Exam created successfully",
      examId,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
});





router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, date, start_time, duration, semester, test_no, batch, sectionn, created_at
      FROM exams
      WHERE 
        CURRENT_DATE >= DATE(created_at)
        AND CURRENT_DATE <= date + INTERVAL '7 days'
      ORDER BY date ASC, start_time ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});




router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const exam = await pool.query(
      "SELECT * FROM exams WHERE id=$1",
      [id]
    );

    const questions = await pool.query(
      "SELECT * FROM questions WHERE exam_id=$1",
      [id]
    );

    res.json({
      ...exam.rows[0],
      questions: questions.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



router.get("/student/:batch/:sectionn", async (req, res) => {
  try {
    const { batch, sectionn } = req.params;

    const exams = await pool.query(
      `SELECT * FROM exams 
   WHERE batch = $1 
   AND sectionn = $2
   AND (
     NOW() <= (
       (date::timestamp + start_time::time) 
       + (duration || ' minutes')::interval 
       + INTERVAL '1 day'
     )
   )
   ORDER BY date, start_time`,
      [batch, sectionn],
    );

    res.json(exams.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});


export default router;