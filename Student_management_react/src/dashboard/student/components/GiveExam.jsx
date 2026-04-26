import React, { useEffect, useState } from "react";
import { checkSubmissionAPI, getStudentExams } from "../../../../service/GlobalApi";

function GiveExam() {
  const [exams, setExams] = useState([]);
  // const submittedExams =
  //   JSON.parse(localStorage.getItem("submittedExams")) || [];

  const [submittedMap, setSubmittedMap] = useState({});

  const getStatus = (exam) => {
    const now = new Date();

    // 1. Create date object from exam.date
    const examStart = new Date(exam.date);

    // 2. Extract hours & minutes from start_time
    const [hours, minutes] = exam.start_time.split(":");

    // 3. Set correct local time
    examStart.setHours(Number(hours));
    examStart.setMinutes(Number(minutes));
    examStart.setSeconds(0);

    // 4. Calculate end time
    const examEnd = new Date(examStart.getTime() + exam.duration * 60000);

    if (now < examStart) return "Upcoming";
    if (now >= examStart && now <= examEnd) return "Active";
    return "Completed";
  };
  const fetchSubmissionStatus = async (exams, user) => {
    const newMap = {};

    for (let exam of exams) {
      try {
        const res = await checkSubmissionAPI(
          user.id,
          exam.semester,
          exam.test_no,
        );

        const data = res.data;

        newMap[exam.id] = data.submitted;
      } catch (err) {
        console.error("Error checking submission:", err);
        newMap[exam.id] = false;
      }
    }

    setSubmittedMap(newMap);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-yellow-100 text-yellow-700";
      case "Active":
        return "bg-green-100 text-green-700";
      case "Completed":
        return "bg-gray-200 text-gray-600";
      default:
        return "";
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const fetchExams = async () => {
      const res = await getStudentExams(user.batch, user.sectionn);
      setExams(res.data);

      await fetchSubmissionStatus(res.data, user);
    };

    fetchExams();
  }, []);

  const handleOpenExam = (examId) => {
    const url = `/student/exam/${examId}`;
    const newTab = window.open(url, "_blank", "noopener,noreferrer");
  };


 useEffect(() => {
   const handleFocus = () => {
     const user = JSON.parse(localStorage.getItem("user"));
     if (!user || exams.length === 0) return;

     fetchSubmissionStatus(exams, user);
   };

   window.addEventListener("focus", handleFocus);

   return () => window.removeEventListener("focus", handleFocus);
 }, [exams]);
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || exams.length === 0) return;

        fetchSubmissionStatus(exams, user);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [exams]);

  return (
    <div className="p-3 pt-2">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Scheduled Exams</h1>

      {exams.length === 0 ? (
        <p className="text-gray-500">No exams scheduled</p>
      ) : (
        <div className="grid gap-5">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="border border-gray-200 rounded-2xl p-4 sm:p-5 bg-white hover:shadow-lg hover:border-blue-300 transition-all"
            >
              {/* Top Row */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                {/* Date + Status */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="text-xs sm:text-sm text-gray-500">
                    {new Date(exam.date).toLocaleDateString("en-GB")}
                  </div>

                  {(() => {
                    const status = getStatus(exam);
                    return (
                      <div
                        className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-semibold ${
                          status === "Upcoming"
                            ? "bg-yellow-100 text-yellow-700"
                            : status === "Active"
                              ? "bg-green-100 text-green-800 animate-pulse"
                              : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {status}
                      </div>
                    );
                  })()}
                </div>

                {/* Time */}
                <div className="text-xs sm:text-sm font-semibold text-blue-600">
                  {exam.start_time}
                </div>
              </div>

              {/* Middle */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                {/* Left Info */}
                <div>
                  <p className="font-semibold text-base sm:text-lg text-gray-800">
                    Semester {exam.semester}
                    <span className="mx-2 text-gray-400">•</span>
                    Test {exam.test_no}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Batch {exam.batch} • Section {exam.sectionn}
                  </p>
                </div>

                {/* Button */}
                {(() => {
                  const status = getStatus(exam);
                  const isSubmitted = submittedMap[exam.id] === true;

                  // const isActive = status === "Active" && !isSubmitted;
                  const isActive = true && !isSubmitted;

                  return (
                    <button
                      disabled={!isActive}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isActive) handleOpenExam(exam.id);
                      }}
                      className={`w-full sm:w-auto text-sm px-4 py-2.5 rounded-lg font-medium transition-all
        ${
          isSubmitted
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : isActive
              ? "bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
                    >
                      {isSubmitted ? "Submitted" : "Start Exam"}
                    </button>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GiveExam;
