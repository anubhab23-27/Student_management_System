import { useEffect, useState } from "react";
import { getExams, getExamById } from "../../../../service/GlobalApi";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function ExamList() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [open, setOpen] = useState(false);

  const getStatus = (exam) => {
    const today = new Date();
    const examDate = new Date(exam.date);

    // remove time part (important)
    today.setHours(0, 0, 0, 0);
    examDate.setHours(0, 0, 0, 0);

    const diffDays = (today - examDate) / (1000 * 60 * 60 * 24);

    if (diffDays < 0) return "Upcoming";
    if (diffDays === 0) return "Today";
    if (diffDays > 0 && diffDays <= 7) return "Completed";

    return "Expired";
  };
  const getStatusStyle = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-700";
      case "Today":
        return "bg-green-100 text-green-700";
      case "Completed":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  useEffect(() => {
    const fetchExams = async () => {
      const res = await getExams();
      setExams(res.data);
    };
    fetchExams();
  }, []);

  const handleOpenExam = async (id) => {
    try {
      const res = await getExamById(id);
      setSelectedExam(res.data);
      setOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Scheduled Exams</h1>

      {exams.length === 0 ? (
        <p className="text-gray-500">No exams scheduled</p>
      ) : (
        <div className="grid gap-4">
          {exams.map((exam) => (
            <div
              key={exam.id}
              onClick={() => handleOpenExam(exam.id)}
              className="border rounded-xl p-4 cursor-pointer bg-white hover:shadow-md transition-all"
            >
              {/* Top Row */}
              <div className="flex justify-between items-center mb-3">
                <div className="text-sm text-gray-500">
                  {new Date(exam.date).toLocaleDateString("en-GB")}
                </div>

                <div className="text-sm font-medium text-blue-600">
                  {exam.start_time}
                </div>
              </div>

              {/* Middle */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg">
                    Semester {exam.semester} • Test {exam.test_no}
                  </p>
                  <p className="text-sm text-gray-500">
                    Batch {exam.batch} • Section {exam.sectionn}
                  </p>
                </div>

                {/* Status badge (optional future use) */}
                {(() => {
                  const status = getStatus(exam);
                  return (
                    <div
                      className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusStyle(
                        status,
                      )}`}
                    >
                      {status}
                    </div>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Drawer */}
      <Drawer open={open} onOpenChange={setOpen} direction="right">
        <DrawerContent className="w-[540px] ml-auto">
          {selectedExam && (
            <>
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="border-b px-5 py-4">
                  <h1 className="text-lg font-semibold">Exam Preview</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(selectedExam.date).toLocaleDateString("en-GB")} •{" "}
                    {selectedExam.start_time}
                  </p>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
                  {/* Exam Info Card */}
                  <div className="bg-gray-50 border rounded-lg p-4 grid grid-cols-2 gap-3 text-sm">
                    <p>
                      <span className="text-muted-foreground">Semester:</span>{" "}
                      {selectedExam.semester}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Test:</span>{" "}
                      {selectedExam.test_no}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Batch:</span>{" "}
                      {selectedExam.batch}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Section:</span>{" "}
                      {selectedExam.sectionn}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Duration:</span>{" "}
                      {selectedExam.duration} min
                    </p>
                  </div>

                  {/* Questions */}
                  <div className="space-y-4">
                    {selectedExam.questions.map((q, i) => (
                      <div
                        key={i}
                        className="border rounded-lg p-4 hover:shadow-sm transition"
                      >
                        <p className="font-medium mb-3">
                          {i + 1}. {q.question}
                        </p>

                        <div className="space-y-2">
                          {q.options.map((opt, j) => {
                            const isCorrect = q.correct_answer === j + 1;

                            return (
                              <div
                                key={j}
                                className={`px-3 py-2 rounded-md border text-sm
                    ${
                      isCorrect
                        ? "bg-green-100 border-green-300 text-green-800 font-medium"
                        : "bg-white"
                    }`}
                              >
                                {opt}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
