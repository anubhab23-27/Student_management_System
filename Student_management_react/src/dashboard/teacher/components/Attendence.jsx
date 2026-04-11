import React, { useEffect, useState } from "react";
import { getAttendance, getFilteredStudents, saveAttendance } from "../../../../service/GlobalApi";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule } from "ag-grid-community";
import { AgGridProvider } from "ag-grid-react";
import { toast } from "sonner";
const modules = [AllCommunityModule];

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import moment from "moment/moment";
import { Checkbox } from "@/components/ui/checkbox";

function Attendence() {
  const [batch, setbatch] = useState("");
  const [sectionn, setsectionn] = useState("");
  const [students, setStudents] = useState([]);
  const [rowData, setRowData] = useState();
  const [date, setDate] = useState(new Date());

  const fetchStudents = async () => {
    try {
      const res = await getFilteredStudents(batch, sectionn);

      const updatedData = res.data.map((student) => ({
        ...student,
        present: false, // default absent
      }));

      setStudents(updatedData);
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    setRowData(students);
  }, [students]);

  
  const CustomCheckbox = (props) => {
    const handleChange = (value) => {
      props.node.setDataValue("present", value);
    };

    return (
      <Checkbox
        checked={props.value || false}
        onCheckedChange={handleChange}
        className="shadow-md border border-gray-500 size-lg align-middle"
      />
    );
  };

const [colDefs] = useState([
  { field: "batch" },
  { field: "sectionn" },
  { field: "phone"},
  { field: "rollnumber" },
  { field: "name", filter: true },
  {
    field: "present",
    headerName: "Present",
    cellRenderer: CustomCheckbox,
  },
]);
  
  
  // save the attendence data in db
  const handleSave = async () => {
    try {
      if (!batch || !sectionn || !rowData?.length) {
        toast("Please select batch, section and load students ⚠️");
        return;
      }

      const formattedDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      const attendanceData = rowData.map((student) => ({
        student_id: student.id,
        rollnumber: student.rollnumber,
        present: student.present || false,
      }));

      const payload = {
        date: formattedDate,
        batch:batch,
        sectionn: sectionn,
        attendance: attendanceData,
      };

      console.log("Sending payload:", payload);

      await saveAttendance(payload);

      toast("Attendance saved successfully ✅");
    } catch (err) {
      console.error(err);
      toast("Error saving attendance ❌");
    }
  };

  // auto load attendence data with respect to date

  const loadAttendance = async () => {
    try {
      if (!date || !batch || !sectionn || !students.length) return;

      // const formattedDate = date.toISOString().split("T")[0];
      const formatDate = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0",
        )}-${String(date.getDate()).padStart(2, "0")}`;
      };
      const formattedDate = formatDate(date);

      const res = await getAttendance(formattedDate, batch, sectionn);
      const savedAttendance = res.data;

      // ✅ Always start from fresh students list
      const updatedData = students.map((student) => {
        const record = savedAttendance.find((a) => a.student_id === student.id);

        return {
          ...student,
          present: record ? record.present : false, // reset properly
        };
      });

      setRowData(updatedData);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (students.length > 0) {
      setRowData(students.map((s) => ({ ...s, present: false })));
    }
  }, [students]);
 useEffect(() => {
   if (students.length > 0 && date && batch && sectionn) {
     loadAttendance();
   }
 }, [students, date, batch, sectionn]);
  useEffect(() => {
    setRowData([]);
  }, [batch, sectionn]);

  return (
    <div>
      <h2 className="text-xl font-bold  my-4">Take Attendence</h2>
      <div className="flex justify-between my-2">
        <div>
          <Popover>
            <PopoverTrigger className="border px-3 py-2 rounded-md flex items-center gap-2">
              <CalendarDays />
              {moment(date).format("DD-MM-YYYY")}
            </PopoverTrigger>

            <PopoverContent className="p-0 w-auto">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
              />
            </PopoverContent>
          </Popover>
        </div>
        {/* 🔽 Filters */}
        <div style={{ display: "flex", gap: "15px", marginBottom: "10px" }}>
          <Select
            defaultValue=""
            onValueChange={(value) => setbatch(value)}
            required
          >
            <SelectTrigger id="batch">
              <SelectValue placeholder="Batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="2026-28">2026-28</SelectItem>
                <SelectItem value="2027-29">2027-29</SelectItem>
                <SelectItem value="2028-30">2028-30</SelectItem>
                <SelectItem value="2029-31">2029-31</SelectItem>
                <SelectItem value="2030-32">2030-32</SelectItem>
                <SelectItem value="2031-33">2031-33</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            defaultValue=""
            onValueChange={(value) => setsectionn(value)}
            required
          >
            <SelectTrigger id="section">
              <SelectValue placeholder="Section" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="D">D</SelectItem>
                <SelectItem value="E">E</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Apply Button */}
          <Button onClick={() => fetchStudents()}>Apply Filter</Button>
        </div>
      </div>

      {/* 📊 Table */}
      <AgGridProvider modules={modules}>
        <div style={{ height: 490 }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            rowHeight={40}
            headerHeight={45}
          />
        </div>
      </AgGridProvider>
      <Button
        onClick={handleSave}
        disabled={!batch || !sectionn || !rowData?.length}
        className="mt-4"
      >
        Save Attendance
      </Button>
    </div>
  );
}

export default Attendence;
