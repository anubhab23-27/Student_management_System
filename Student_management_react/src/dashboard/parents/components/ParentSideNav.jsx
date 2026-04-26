import { History, PencilRuler, Percent, Menu, X, ClipboardList } from "lucide-react";
import React, { useState } from "react";

function ParentSideNav({ setActivePage, activePage }) {
  const [isOpen, setIsOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) 
  
  const navItems = [
    {
      id: "viewAttendence",
      label: "View Attendance",
      icon: <History size={18} />,
    },
    { id: "viewMarks", label: "Marks Report", icon: <Percent size={18} /> },
    {
      id: "parentNotice",
      label: "Notice Board",
      icon: <ClipboardList size={18} />,
    },
  ];

  const handleNav = (page) => {
    setActivePage(page);
    setIsOpen(false); // close drawer on mobile after selecting
  };

  return (
    <>
      {/* ── Mobile hamburger button (hidden on md+) ── */}
      {/* <button
        onClick={() => setIsOpen(true)}
        className="fixed top-1.5 left-1.5 z-50 md:hidden p-2 rounded-lg "
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button> */}

      {/* ── Mobile Bottom Navigation ── */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md flex justify-around items-center py-2 md:hidden z-50">
        {navItems.map(({ id, label, icon }) => {
          const isActive = activePage === id;

          return (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className="flex flex-col items-center text-xs"
            >
              {/* Pill background */}
              <div
                className={`
            px-6 py-1.5 rounded-full transition-all duration-300
            flex items-center justify-center
            ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-500"}
          `}
              >
                {icon}
              </div>

              {/* Label */}
              <span
                className={`
            mt-1 text-[11px] transition-all
            ${isActive ? "font-semibold text-black" : "text-gray-500"}
          `}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Backdrop overlay (mobile only) ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 text-white p-5
          flex flex-col overflow-y-auto shadow-2xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:h-[calc(100vh-52px)] md:shadow-none
        `}
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Student Panel</h1>
          {/* Close button — only visible on mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-400 hover:text-white transition"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-3">
          {navItems.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={`text-left px-4 py-2.5 rounded-lg transition-colors flex items-center gap-3
                ${
                  activePage === id
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
            >
              {icon}
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto text-gray-300 pt-4 border-t border-gray-700 text-sm space-y-1">
          <p>
            <span className="text-gray-400 font-semibold">Name:</span>{" "}
            {user.name}
          </p>
          <p>
            <span className="text-gray-400 font-semibold">Roll No:</span>{" "}
            {user.rollnumber}
          </p>
          <p>
            <span className="text-gray-400 font-semibold">Batch:</span>{" "}
            {user.batch}
            <span className="ml-3 text-gray-400 font-semibold">
              Section:
            </span>{" "}
            {user.sectionn}
          </p>
        </div>
      </aside>
    </>
  );
}

export default ParentSideNav;
