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
      const d = new Date(item.date).getDate(); // ✅ local IST timezone, not UTC
      return d === day;
    });

    return found ? found.present : null;
  };

  const getStartOffset = () => {
    const [year, monthNum] = month.split("-").map(Number);

    const firstDay = new Date(year, monthNum - 1, 1);

    let day = firstDay.getDay(); // 0 = Sunday

    // Convert to Monday-based (0 = Monday)
    return day === 0 ? 6 : day - 1;
  };

  // Calculate attendence percentage
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

  // ✅ Auto fetch when month changes
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
      calculateStats(attendance); // 🔥 important
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="px-4 ">
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl font-bold my-4">Monthly Attendance Report</h2>
          {/* Month Picker */}
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border px-3 py-2 rounded-md"
          />
        </div>
        {/* Report */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-gray-100 text-center">
            <div className="text-sm text-gray-600">Total Classes</div>
            <div className="text-xl font-bold">{stats.total}</div>
          </div>

          <div className="p-4 rounded-lg bg-green-100 text-center">
            <div className="text-sm text-green-700">Present</div>
            <div className="text-xl font-bold text-green-800">
              {stats.present}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-blue-100 text-center">
            <div className="text-sm text-blue-700">Attendance %</div>
            <div className="text-xl font-bold text-blue-800">
              {stats.percentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Calender$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ */}
      <div className="max-h-[512px] overflow-y-auto mt-6">
        {/* Week Header */}
        <div className="grid grid-cols-7 text-center font-bold mb-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* 🔹 Empty boxes before 1st day */}
          {Array.from({ length: getStartOffset() }).map((_, i) => (
            <div key={"empty-" + i}></div>
          ))}

          {/* 🔹 Actual days */}
          {getDaysInMonth().map((d, index) => {
            const status = getStatusForDate(d.day);

            return (
              <div
                key={index}
                className={`p-3 text-center rounded-md text-sm font-semibold border 
  transition-colors duration-75 
  ${
    status === true
      ? "bg-green-200 text-green-800 hover:bg-green-300"
      : status === false
        ? "bg-red-200 text-red-800 hover:bg-red-300"
        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
  }`}
              >
                <div className="text-xs">{d.dayName}</div>
                <div className="text-lg font-bold">{d.day}</div>
                <div>
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
