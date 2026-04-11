import SideNav from "@/dashboard/student/components/SideNav";
import ViewAttendence from "@/dashboard/student/components/ViewAttendence";
import ViewMarks from "@/dashboard/student/components/ViewMarks";
import AddStudent from "@/dashboard/teacher/components/AddStudent";
import ViewStudentDetails from "@/dashboard/teacher/components/ViewStudentDetails";
import React, { useState } from "react";

function StudentDashboard({children}) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [activePage, setActivePage] = useState("viewAttendence");

  return (
    <div className="flex ">
      {/* Sidebar */}
      <div className="w-[270px]  hidden md:block">
        <SideNav setActivePage={setActivePage} />
      </div>

      {/* Dynamic Content */}
      <div className="flex-1 p-4 overflow-x-auto">
        {activePage === "viewAttendence" && <ViewAttendence />}
        {activePage === "viewMarks" && <ViewMarks />}
      </div>
    </div>
  );
}

export default StudentDashboard;
