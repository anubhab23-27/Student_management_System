import ParentNotice from "@/dashboard/parents/components/ParentNotice";
import GiveExam from "@/dashboard/student/components/GiveExam";
import SideNav from "@/dashboard/student/components/SideNav";
import ViewAttendence from "@/dashboard/student/components/ViewAttendence";
import ViewMarks from "@/dashboard/student/components/ViewMarks";
import React, { useState } from "react";

function StudentDashboard() {
  const [activePage, setActivePage] = useState("studentNotice");

  return (
    <div className="flex">
      {/* Sidebar — handles its own mobile/desktop visibility internally */}
      <SideNav setActivePage={setActivePage} activePage={activePage} />

      {/* Dynamic Content */}
      <div className="flex-1 p-4 overflow-x-auto">
        {activePage === "viewAttendence" && <ViewAttendence />}
        {activePage === "viewMarks" && <ViewMarks />}
        {activePage === "giveExam" && <GiveExam />}
        {activePage === "studentNotice" && <ParentNotice/>}
      </div>
    </div>
  );
}

export default StudentDashboard;
