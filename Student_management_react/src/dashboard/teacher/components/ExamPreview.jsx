import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { createExam } from "../../../../service/GlobalApi";
import { toast } from "sonner";

export default function ExamPreview() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <p>No data</p>;

  const {
    date,
    startTime,
    duration,
    semester,
    testNo,
    batch,
    sectionn,
    questions,
  } = state;

  const handlePublish = async () => {
    try {
      await createExam(state);

      toast("Exam Published!");
      navigate("/teacher");
    } catch (err) {
      console.error(err);
      toast("Error publishing exam");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Exam Preview</h1>

      {/* Exam Details */}
      <div className="border p-4 rounded">
        <p>
          <b>Date:</b> {new Date(date).toLocaleDateString("en-GB")}
        </p>
        <p>
          <b>Start Time:</b> {startTime}
        </p>
        <p>
          <b>Duration:</b> {duration} min
        </p>
        <p>
          <b>Semester:</b> {semester}
        </p>
        <p>
          <b>Test:</b> {testNo}
        </p>
        <p>
          <b>Batch:</b> {batch}
        </p>
        <p>
          <b>Section:</b> {sectionn}
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={i} className="border p-4 rounded">
            <p className="font-semibold">
              {i + 1}. {q.question}
            </p>

            <ul className="mt-2 space-y-1">
              {q.options.map((opt, j) => (
                <li
                  key={j}
                  className={`px-2 py-1 rounded ${
                    q.correctAnswer === String(j + 1) ? "bg-green-200" : ""
                  }`}
                >
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Publish Button */}
      <button
        onClick={handlePublish}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Publish Exam
      </button>
    </div>
  );
}
