import { Toaster } from "@/components/ui/sonner";
import { PlusSquare, PlusSquareIcon } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddStudent from "@/dashboard/teacher/components/AddStudent";
import ViewStudentDetails from "@/dashboard/teacher/components/ViewStudentDetails";
import SideNav from "@/dashboard/teacher/components/SideNav";
import Attendence from "@/dashboard/teacher/components/Attendence";
import TakeExam from "@/dashboard/teacher/components/TakeExam";
import GiveMarks from "@/dashboard/teacher/components/GiveMarks";
import RevewAttendence from "@/dashboard/teacher/components/RevewAttendence";
import MarksReport from "@/dashboard/teacher/components/MarksReport";

function TeacherDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [activePage, setActivePage] = useState("attenedence");
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const [formData, setFormData] = useState({
    rollnumber: "",
    name: "",
    phone: "",
    parentPhone: "",
    batch: "",
    password: "",
  });

  // handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

   return (
     <div className="flex ">
       <Toaster />

       {/* Sidebar */}
       <div className="w-[270px]  hidden md:block">
         <SideNav setActivePage={setActivePage} />
       </div>

       {/* Content */}
       <div className="flex-1 p-4 overflow-x-auto">
         {activePage === "view" && <ViewStudentDetails />}
         {activePage === "exam" && <TakeExam />}
         {activePage === "giveMarks" && <GiveMarks />}
         {activePage === "attenedence" && <Attendence />}
         {activePage === "reviewAttendence" && <RevewAttendence />}
         {activePage === "marksReport" && <MarksReport />}
       </div>
     </div>
   );
}

export default TeacherDashboard;
