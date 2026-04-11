import { FileChartLine, GraduationCap, Hand, History, PencilRuler, Percent } from 'lucide-react';
import React from 'react'

function SideNav({ setActivePage, activePage }) {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="h-[calc(100vh-52px)] bg-gray-900 text-white p-5 flex flex-col overflow-y-auto">
      {/* Admin */}
      <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>

      {/* Menu */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => setActivePage("view")}
          className={`text-left px-4 py-2 rounded-lg transition flex gap-2
          ${activePage === "view" ? "bg-blue-600" : "hover:bg-gray-700"}`}
        >
          <GraduationCap /> View Student Details
        </button>
        <button
          onClick={() => setActivePage("reviewAttendence")}
          className={`text-left px-4 py-2 rounded-lg transition flex gap-2
          ${activePage === "reviewAttendence" ? "bg-blue-600" : "hover:bg-gray-700"}`}
        >
          <History /> Review Attendence
        </button>
        <button
          onClick={() => setActivePage("marksReport")}
          className={`text-left px-4 py-2 rounded-lg transition flex gap-2
          ${activePage === "marksReport" ? "bg-blue-600" : "hover:bg-gray-700"}`}
        >
          <Percent /> Student Marks
        </button>
      </div>

      {/* Teacher */}
      <h1 className="text-2xl font-bold my-8 pt-4 border-t border-gray-700">
        Teacher Panel
      </h1>
      <div className="flex flex-col gap-3">
        {/* Take a Exam */}
        <button
          onClick={() => setActivePage("exam")}
          className={`text-left px-4 py-2 rounded-lg transition flex gap-2
          ${activePage === "exam" ? "bg-blue-600" : "hover:bg-gray-700"}`}
        >
          <PencilRuler /> New Exam
        </button>

        {/* Give Marks */}
        <button
          onClick={() => setActivePage("giveMarks")}
          className={`text-left px-4 py-2 rounded-lg transition flex gap-2
          ${activePage === "giveMarks" ? "bg-blue-600" : "hover:bg-gray-700"}`}
        >
          <FileChartLine /> Give Marks
        </button>

        {/* Take Attendence */}
        <button
          onClick={() => setActivePage("attenedence")}
          className={`text-left px-4 py-2 rounded-lg transition flex gap-2
          ${activePage === "attenedence" ? "bg-blue-600" : "hover:bg-gray-700"}`}
        >
          <Hand /> Attendance
        </button>
      </div>

      {/* Footer */}
      <div className="mt-auto text-gray-300 pt-4 border-t border-gray-700">
        <p>
          <b>Name:</b> {user.name}
        </p>
        <p>
          <b>Email:</b> {user.email}
        </p>
      </div>
    </div>
  );
}

export default SideNav;
