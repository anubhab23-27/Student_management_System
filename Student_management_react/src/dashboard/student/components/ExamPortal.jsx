
import useExamSecurity from "@/hooks/examSecurity";
import { Clock4 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function ExamPortal() {
  useExamSecurity();
  const navigate = useNavigate();
  const { examId } = useParams();
  const [student, setStudent] = useState(null);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const calculateScore = () => {
    let score = 0;

    questions.forEach((q, index) => {
      // correct_answer is 1-based (1,2,3,4)
      if (answers[index] === q.correct_answer - 1) {
        score++;
      }
    });

    return score;
  };

  const handleSubmit = async () => {
    if (submitted) return; // 🔥 prevents double submit

    if (!window.confirm("Are you sure you want to submit the exam?")) return;
    setSubmitted(true);
    const submittedExams =
      JSON.parse(localStorage.getItem("submittedExams")) || [];

    submittedExams.push(exam.id);

    localStorage.setItem("submittedExams", JSON.stringify(submittedExams));

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("User not found");
      return;
    }

    const score = calculateScore();

    const payload = {
      exam_date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      marks: [
        {
          student_id: user.id,
          semester: exam.semester,
          exam_number: exam.test_no, // IMPORTANT
          marks_obtained: score,
          max_marks: questions.length,
        },
      ],
    };

    try {
      const res = await fetch("http://localhost:5000/api/marks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // alert(`Exam submitted!\nScore: ${score}/${questions.length}`);

      navigate(`/student/${user.rollnumber}`);
    } catch (err) {
      console.error(err);
      alert("Error submitting exam");
      setSubmitted(false); // 🔥 unlock if error
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      console.error("No user found");
      return;
    }

    setStudent(storedUser);

    const fetchExam = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/exams/${examId}`);
        const data = await res.json();

        setExam(data); // full exam
        setQuestions(data.questions); // separate questions
      } catch (err) {
        console.error("Error fetching exam:", err);
      }
    };

    if (examId) fetchExam();
  }, [examId]);

  useEffect(() => {
    if (!exam) return;
    console.log(exam);
    // Step 1: extract date properly
    const examDate = new Date(exam.date);

    // Step 2: extract time
    const [hours, minutes, seconds] = exam.start_time.split(":");

    // Step 3: set correct local time
    examDate.setHours(hours, minutes, seconds, 0);

    const startDateTime = examDate;
    const endDateTime = new Date(
      startDateTime.getTime() + exam.duration * 60000,
    );

    const interval = setInterval(() => {
      const now = new Date();
      const diff = endDateTime - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        console.log("Time up!");
        handleSubmit(); // 🔥 auto submit
      }

      setTimeLeft(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [exam]);

  const formatTime = (ms) => {
    if (ms <= 0) return "00:00:00";

    const totalSeconds = Math.floor(ms / 1000);
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");

    return `${h}:${m}:${s}`;
  };

  return (
    <div>
      <header className="h-16 flex items-center justify-between px-6 border-slate-200 bg-slate-100 sticky top-0 z-50">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <div className="leading-tight">
            <p className="text-xl font-bold">Examination</p>
            <p className="text-lg font-semibold">
              Semester {exam?.semester} • Test {exam?.test_no}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* Timer */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl border border-slate-200 bg-white shadow-sm text-lg font-semibold text-slate-700 font-mono tabular-nums">
            <Clock4 className="w-5 h-5 text-slate-500" />
            <span className="min-w-[90px] text-center">
              {timeLeft !== null ? formatTime(timeLeft) : "Loading..."}
            </span>
          </div>

          {/* Finish */}
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-bold"
          >
            Finish Exam
          </button>
        </div>
      </header>
      {student && (
        <div className="flex bg-slate-100 select-none exam-container">
          {/* LEFT — Main Exam Area */}
          <div className="flex-1 p-6  border border-slate-200 rounded-2xl shadow-xl bg-white mt-4">
            {/* Questions will come here later */}

            {questions.length > 0 && (
              <div className="bg-white  p-6  mt-16">
                <p className="text-sm text-slate-500 mb-2">
                  Question {currentQuestion + 1} of {questions.length}
                </p>

                <h2 className="text-lg font-semibold text-slate-800 mb-6">
                  {questions[currentQuestion].question}
                </h2>

                {/* Options */}
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((opt, idx) => (
                    <div
                      key={idx}
                      onClick={() =>
                        setAnswers({
                          ...answers,
                          [currentQuestion]: idx,
                        })
                      }
                      className={`p-3 rounded-lg border cursor-pointer transition-all  shadow-xs
            ${
              answers[currentQuestion] === idx
                ? "border-blue-500 bg-blue-100"
                : "border-slate-200 bg-slate-50 hover:border-blue-300"
            }`}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end mt-6 gap-4">
              <button
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
                className="px-4 py-2 border rounded-lg bg-slate-50"
              >
                Previous
              </button>

              <button
                disabled={currentQuestion === questions.length - 1}
                onClick={() => setCurrentQuestion((prev) => prev + 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Next
              </button>
            </div>
          </div>

          {/* RIGHT — Sidebar */}
          <div className="w-[320px]  bg-slate-100 p-4 h-[calc(100vh-4rem)]">
            {/* Sidebar content */}
            <div className="flex flex-col gap-4">
              {/* Student Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                {/* Top: Avatar + Name */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 font-bold text-lg">
                    {student.name?.charAt(0).toUpperCase()}
                  </div>

                  {/* Name + Roll */}
                  <div>
                    <p className="font-semibold text-base text-slate-800">
                      {student.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {student.rollnumber}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-200 my-4"></div>

                {/* Info rows */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Batch</span>
                    <span className="font-medium text-slate-800">
                      {student.batch}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Section</span>
                    <span className="font-medium text-slate-800">
                      {student.sectionn}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Question grid */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mt-4">
              {/* Title */}
              <p className="text-sm font-semibold text-slate-600 mb-4">
                Questions ({questions.length})
              </p>

              {/* Grid */}
              <div className="grid grid-cols-5 gap-3">
                {questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-10 h-10 rounded-lg border text-sm font-medium transition-all
    ${
      currentQuestion === index
        ? "border-blue-500 text-blue-600 bg-blue-50"
        : answers[index] !== undefined
          ? "border-green-300 text-green-600 bg-green-50"
          : "border-slate-200 text-slate-600 hover:border-blue-300"
    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExamPortal;
