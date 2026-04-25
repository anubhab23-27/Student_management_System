import useExamSecurity from "@/hooks/examSecurity";
import { Clock4 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getExamById, submitMarks } from "../../../../service/GlobalApi";

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

  const mobileGridRefs = useRef([]);

  useEffect(() => {
    const btn = mobileGridRefs.current[currentQuestion];
    if (btn) {
      btn.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentQuestion]);

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correct_answer - 1) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = async () => {
    if (submitted) return;
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
      exam_date: new Date().toISOString().split("T")[0],
      marks: [
        {
          student_id: user.id,
          semester: exam.semester,
          exam_number: exam.test_no,
          marks_obtained: score,
          max_marks: questions.length,
        },
      ],
    };
    try {
      const res = await submitMarks(payload);
      const data = res.data;
      navigate(`/student/${user.rollnumber}`);
    } catch (err) {
      console.error(err);
      alert("Error submitting exam");
      setSubmitted(false);
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
        const res = await getExamById(examId);
        const data = res.data;
        setExam(data);
        setQuestions(data.questions);
      } catch (err) {
        console.error("Error fetching exam:", err);
      }
    };
    if (examId) fetchExam();
  }, [examId]);

  useEffect(() => {
    if (!exam) return;
    const examDate = new Date(exam.date);
    const [hours, minutes, seconds] = exam.start_time.split(":");
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
        handleSubmit();
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
    <div className="flex flex-col min-h-screen bg-slate-100">
      {/* ── HEADER ── */}
      <header className="h-14 md:h-16 flex items-center justify-between px-3 md:px-6 border-b border-slate-200 bg-slate-100 sticky top-0 z-50">
        {/* LEFT */}
        <div className="leading-tight">
          <p className="text-base md:text-xl font-bold">Examination</p>
          <p className="text-xs md:text-lg font-semibold text-slate-600">
            Sem {exam?.semester} • Test {exam?.test_no}
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Timer */}
          <div className="flex items-center gap-1.5 px-2.5 md:px-4 py-1.5 rounded-xl border border-slate-200 bg-white shadow-sm text-sm md:text-lg font-semibold text-slate-700 font-mono tabular-nums">
            <Clock4 className="w-4 h-4 md:w-5 md:h-5 text-slate-500 shrink-0" />
            <span className="min-w-[72px] md:min-w-[90px] text-center">
              {timeLeft !== null ? formatTime(timeLeft) : "Loading..."}
            </span>
          </div>

          {/* Finish */}
          <button
            onClick={handleSubmit}
            className="px-3 md:px-4 py-1.5 md:py-2 bg-red-600 text-white rounded-md text-sm md:text-base font-bold"
          >
            Finish
          </button>
        </div>
      </header>

      {student && (
        <>
          {/* ── MOBILE: student info strip ── */}
          <div className="flex md:hidden items-center gap-3 px-3 py-2 bg-white border-b border-slate-200">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 font-bold text-sm shrink-0">
              {student.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-slate-800 truncate">
                {student.name}
              </p>
              <p className="text-xs text-slate-500">
                {student.rollnumber} · Batch {student.batch} · Sec{" "}
                {student.sectionn}
              </p>
            </div>
          </div>

          {/* ── LAYOUT WRAPPER ── */}
          <div className="flex flex-col md:flex-row bg-slate-100 select-none exam-container flex-1">
            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 p-3 md:p-6">
              <div className="border border-slate-200 rounded-2xl shadow-xl bg-white overflow-hidden md:mt-4">
                {questions.length > 0 && (
                  <>
                    {/* ── MOBILE: question grid (horizontal scroll) ── */}
                    <div className="flex md:hidden items-center gap-2 px-3 py-2.5 border-b border-slate-100 overflow-x-auto scrollbar-none">
                      <span className="text-xs text-slate-400 font-medium shrink-0">
                        Q
                      </span>
                      {questions.map((q, index) => (
                        <button
                          key={q.id}
                          ref={(el) => (mobileGridRefs.current[index] = el)}
                          onClick={() => setCurrentQuestion(index)}
                          className={`w-8 h-8 shrink-0 rounded-lg border text-xs font-medium transition-all
                            ${
                              currentQuestion === index
                                ? "border-blue-500 text-blue-600 bg-blue-50"
                                : answers[index] !== undefined
                                  ? "border-green-300 text-green-600 bg-green-50"
                                  : "border-slate-200 text-slate-500 hover:border-blue-300"
                            }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>

                    {/* ── QUESTION BODY ── */}
                    <div className="p-4 md:p-6 md:mt-7">
                      <p className="text-xs md:text-sm text-slate-500 mb-2">
                        Question {currentQuestion + 1} of {questions.length}
                      </p>

                      <h2 className="text-base md:text-lg font-semibold text-slate-800 mb-5 md:mb-6">
                        {questions[currentQuestion].question}
                      </h2>

                      {/* Options */}
                      <div className="space-y-2.5 md:space-y-3">
                        {questions[currentQuestion].options.map((opt, idx) => (
                          <div
                            key={idx}
                            onClick={() =>
                              setAnswers({ ...answers, [currentQuestion]: idx })
                            }
                            className={`p-3 rounded-lg border cursor-pointer transition-all text-sm md:text-base
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
                  </>
                )}

                {/* Navigation buttons */}
                <div className="flex justify-end px-4 md:px-6 pb-4 md:pb-6 pt-12 gap-3">
                  <button
                    disabled={currentQuestion === 0}
                    onClick={() => setCurrentQuestion((prev) => prev - 1)}
                    className="px-4 py-2 border rounded-lg bg-slate-50 text-sm md:text-base disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentQuestion === questions.length - 1}
                    onClick={() => setCurrentQuestion((prev) => prev + 1)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm md:text-base disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* ── DESKTOP SIDEBAR (hidden on mobile) ── */}
            <div className="hidden md:block w-[320px] bg-slate-100 p-4 mt-5 h-[calc(100vh-4rem-1.25rem)] overflow-y-auto">
              <div className="flex flex-col gap-4">
                {/* Student Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 font-bold text-lg">
                      {student.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-base text-slate-800">
                        {student.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {student.rollnumber}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-slate-200 my-4"></div>
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
                <p className="text-sm font-semibold text-slate-600 mb-4">
                  Questions ({questions.length})
                </p>
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
        </>
      )}
    </div>
  );
}

export default ExamPortal;
