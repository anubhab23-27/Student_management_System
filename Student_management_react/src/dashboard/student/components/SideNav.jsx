import { History, Percent } from 'lucide-react';
import React from 'react'

function SideNav({ setActivePage, activePage }) {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="h-[calc(100vh-52px)] bg-gray-900 text-white p-5 flex flex-col overflow-y-auto">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-8">Student Panel</h1>

      {/* Menu */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => setActivePage("viewAttendence")}
          className={`text-left px-4 py-2 rounded-lg transition flex gap-2
          ${activePage === "viewAttendence" ? "bg-blue-600" : "hover:bg-gray-700"}`}
        >
          <History />
          View Attendence
        </button>

        <button
          onClick={() => setActivePage("viewMarks")}
          className={`text-left px-4 py-2 rounded-lg transition flex gap-2
          ${activePage === "viewMarks" ? "bg-blue-600" : "hover:bg-gray-700"}`}
        >
          <Percent />
          Marks Report
        </button>
      </div>

      {/* Footer */}
      <div className="mt-auto text-gray-300 pt-4 border-t border-gray-700">
        <p>
          <b>Name:</b> {user.name}
        </p>
        <p>
          <b>Roll Number:</b> {user.rollnumber}
        </p>
        <p>
          <b>Batch:</b> {user.batch}
          <b className="ml-4">Section:</b> {user.sectionn}
        </p>
      </div>
    </div>
  );
}

export default SideNav;
