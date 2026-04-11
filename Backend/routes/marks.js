import express from "express";
import pool from "../db.js";

const router = express.Router();

// Add marks
router.post("/", async (req, res) => {
  try {
    const { exam_date, marks } = req.body;

    for (const m of marks) {
      await pool.query(
        `INSERT INTO marks 
  (student_id, semester, exam_number, marks_obtained, max_marks, exam_date)
  VALUES ($1,$2,$3,$4,$5,$6)
  ON CONFLICT (student_id, semester, exam_number)
  DO UPDATE SET 
    marks_obtained = EXCLUDED.marks_obtained,
    max_marks = EXCLUDED.max_marks,
    exam_date = EXCLUDED.exam_date`,
        [
          m.student_id,
          m.semester,
          m.exam_number,
          m.marks_obtained,
          m.max_marks,
          exam_date,
        ],
      );
    }

    res.json({ message: "Marks saved successfully" });
  } catch (err) {
    console.error("ERROR MESSAGE:", err.message);
    console.error("ERROR DETAIL:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/marksReport", async (req, res) => {
  const { batch, sectionn, semester } = req.query;

  const semesterInt = parseInt(semester);

  console.log("PARAMS:", batch, sectionn, semesterInt);

  try {
    const result = await pool.query(
      `SELECT 
        s.id as student_id,
        s.rollnumber,
        s.name,
        m.exam_number,
        m.exam_date,
        m.max_marks,
        m.marks_obtained
      FROM students s
      LEFT JOIN marks m 
        ON s.id = m.student_id 
        AND m.semester = $3
      WHERE s.batch=$1 AND s.sectionn=$2
      ORDER BY s.rollnumber, m.exam_date`,
      [batch, sectionn, semesterInt]
    );

    console.log("ROWS:", result.rows.length); // 👈 DEBUG

    const studentsMap = {};

    result.rows.forEach((row) => {
      if (!studentsMap[row.student_id]) {
        studentsMap[row.student_id] = {
          rollnumber: row.rollnumber,
          name: row.name,
          marks: [],
        };
      }

      if (row.exam_number) {
        studentsMap[row.student_id].marks.push({
          test_id: row.exam_number,
          exam_date: row.exam_date,
          max_marks: row.max_marks,
          marks_obtained: row.marks_obtained,
        });
      }
    });

    res.json(Object.values(studentsMap));
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});router.get("/marksReport", async (req, res) => {
  const { batch, sectionn, semester } = req.query;

  const semesterInt = parseInt(semester);

  console.log("PARAMS:", batch, sectionn, semesterInt);

  try {
    const result = await pool.query(
      `SELECT 
        s.id as student_id,
        s.rollnumber,
        s.name,
        m.exam_number,
        m.exam_date,
        m.max_marks,
        m.marks_obtained
      FROM students s
      LEFT JOIN marks m 
        ON s.id = m.student_id 
        AND m.semester = $3
      WHERE s.batch=$1 AND s.sectionn=$2
      ORDER BY s.rollnumber, m.exam_date`,
      [batch, sectionn, semesterInt],
    );

    console.log("ROWS:", result.rows.length); // 👈 DEBUG

    const studentsMap = {};

    result.rows.forEach((row) => {
      if (!studentsMap[row.student_id]) {
        studentsMap[row.student_id] = {
          rollnumber: row.rollnumber,
          name: row.name,
          marks: [],
        };
      }

      if (row.exam_number) {
        studentsMap[row.student_id].marks.push({
          test_id: row.exam_number,
          exam_date: row.exam_date,
          max_marks: row.max_marks,
          marks_obtained: row.marks_obtained,
        });
      }
    });

    res.json(Object.values(studentsMap));
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


// GET marks for one student

router.get("/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const result = await pool.query(
      `SELECT 
        id,
        semester,
        exam_number,
        marks_obtained,
        max_marks,
        exam_date
       FROM marks
       WHERE student_id = $1
       ORDER BY exam_date DESC`,
      [studentId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
