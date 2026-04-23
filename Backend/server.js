import express from "express";
import cors from "cors";
import pool from "./db.js";
import studentRoutes from "./routes/studentRoutes.js";
import attendanceRoutes from "./routes/attendance.js";
import marksRoutes from "./routes/marks.js";
import examRoutes from "./routes/exam.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/exams", examRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// test DB connection
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});

// Authentication check $$$$$$$$$$$$$$$$$$

app.post("/api/auth/login", async (req, res) => {
  const { role, rollNumber, password, email } = req.body;

  try {
    console.log("Incoming role:", role);
    if (role === "student" || role === "parent") {
      const result = await pool.query(
        "SELECT * FROM students WHERE rollnumber = $1",
        [rollNumber],
      );

      if (result.rows.length === 0) {
        return res.status(400).json({ message: "Student not found" });
      }

      const user = result.rows[0];

      if (user.password !== password) {
        return res.status(400).json({ message: "Invalid password" });
      }

      return res.json({ message: "Login successful", user });
    }

    if (role === "teacher") {
      const result = await pool.query(
        "SELECT * FROM teachers WHERE email = $1",
        [email],
      );

      if (result.rows.length === 0) {
        return res.status(400).json({ message: "Teacher not found" });
      }

      const user = result.rows[0];

      if (user.password !== password) {
        return res.status(400).json({ message: "Invalid password" });
      }

      return res.json({ message: "Login successful", user });
    }

    res.status(400).json({ message: "Invalid role" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add new student$$$$$$$$$$$$$$$$

app.post("/api/students", async (req, res) => {
  try {
    const { name, rollnumber, password, phone, parent_phone, batch, section } =
      req.body;

    const newStudent = await pool.query(
      `INSERT INTO students 
      (rollnumber, name, password, phone, parent_phone, batch, sectionn) 
      VALUES ($1,$2,$3,$4,$5,$6,$7) 
      RETURNING *`,
      [rollnumber, name, password, phone, parent_phone, batch, section],
    );

    res.json(newStudent.rows[0]);
  } catch (err) {
    // 🔴 Handle duplicate rollnumber
    if (err.code === "23505") {
      return res.status(400).json({
        error: "Roll number already exists",
      });
    }

    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});