import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  getStudentAttendance,
  getStudentByRoll,
} from "../../../../service/GlobalApi";

function ViewAttendence() {
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  };

  const [month, setMonth] = useState(getCurrentMonth());
  const [data, setData] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const rollnumber = user?.rollnumber;

  const getDaysInMonth = () => {
    const [year, monthNum] = month.split("-").map(Number);
    const daysInMonth = new Date(year, monthNum, 0).getDate();
    const daysArray = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(Date.UTC(year, monthNum - 1, i));
      daysArray.push({
        date,
        day: i,
        dayName: date.toLocaleDateString("en-US", {
          weekday: "short",
          timeZone: "UTC",
        }),
      });
    }
    return daysArray;
  };

  const getStatusForDate = (day) => {
    const found = data.find((item) => {
      const d = new Date(item.date).getDate();
      return d === day;
    });
    return found ? found.present : null;
  };

  const getStartOffset = () => {
    const [year, monthNum] = month.split("-").map(Number);
    const firstDay = new Date(year, monthNum - 1, 1);
    let day = firstDay.getDay();
    return day === 0 ? 6 : day - 1;
  };

  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    percentage: 0,
  });

  const calculateStats = (attendance) => {
    const total = attendance.length;
    const present = attendance.filter((a) => a.present).length;
    const percentage = total ? ((present / total) * 100).toFixed(2) : 0;
    setStats({ total, present, percentage });
  };

  useEffect(() => {
    fetchStudentId();
  }, []);

  const fetchStudentId = async () => {
    try {
      const res = await getStudentByRoll(rollnumber);
      setStudentId(res.data.id);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchAttendance();
    }
  }, [month, studentId]);

  const fetchAttendance = async () => {
    try {
      const res = await getStudentAttendance(studentId, month);
      const attendance = res.data.attendance;
      setData(attendance);
      calculateStats(attendance);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="px-3 sm:px-4">
      {/* ── Header: stacks vertically on mobile, side-by-side on sm+ ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mt-4 mb-2">
        {/* Title + Month Picker */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg sm:text-xl font-bold">
            Monthly Attendance Report
          </h2>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border px-3 py-2 rounded-md w-full sm:w-auto text-sm"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="p-3 sm:p-4 rounded-lg bg-gray-100 text-center">
            <div className="text-xs sm:text-sm text-gray-600">Total</div>
            <div className="text-lg sm:text-xl font-bold">{stats.total}</div>
          </div>

          <div className="p-3 sm:p-4 rounded-lg bg-green-100 text-center">
            <div className="text-xs sm:text-sm text-green-700">Present</div>
            <div className="text-lg sm:text-xl font-bold text-green-800">
              {stats.present}
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-lg bg-blue-100 text-center">
            <div className="text-xs sm:text-sm text-blue-700">Attend %</div>
            <div className="text-lg sm:text-xl font-bold text-blue-800">
              {stats.percentage}%
            </div>
          </div>
        </div>
      </div>

      {/* ── Calendar ── */}
      <div className="max-h-[512px] overflow-y-auto mt-4">
        {/* Week Header */}
        <div className="grid grid-cols-7 text-center font-bold mb-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="text-xs sm:text-sm py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Empty offset boxes */}
          {Array.from({ length: getStartOffset() }).map((_, i) => (
            <div key={"empty-" + i} />
          ))}

          {/* Day cells */}
          {getDaysInMonth().map((d, index) => {
            const status = getStatusForDate(d.day);

            return (
              <div
                key={index}
                className={`
                  flex flex-col items-center justify-center
                  p-1 sm:p-3 rounded-md border text-center
                  transition-colors duration-75 min-h-[52px] sm:min-h-[72px]
                  ${
                    status === true
                      ? "bg-green-200 text-green-800 hover:bg-green-300"
                      : status === false
                        ? "bg-red-200 text-red-800 hover:bg-red-300"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }
                `}
              >
                <div className="text-[9px] sm:text-xs leading-tight">
                  {d.dayName}
                </div>
                <div className="text-sm sm:text-lg font-bold leading-tight">
                  {d.day}
                </div>
                <div className="text-[10px] sm:text-sm font-semibold leading-tight">
                  {status === true ? "P" : status === false ? "A" : "-"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ViewAttendence;
