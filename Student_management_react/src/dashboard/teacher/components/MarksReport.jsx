import React, { useEffect, useState } from "react";
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
import { CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import moment from "moment/moment";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule } from "ag-grid-community";
import { AgGridProvider } from "ag-grid-react";
import { toast } from "sonner";
const modules = [AllCommunityModule];

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  getFilteredStudents,
  getMarksReport,
  getMonthlyAttendance,
} from "../../../../service/GlobalApi";

function MarksReport() {
  const [students, setStudents] = useState([]);
  const [rowData, setRowData] = useState();
  const [batch, setbatch] = useState("");
  const [sectionn, setsectionn] = useState("");
  const [semester, setsemester] = useState("");
  const [tests, setTests] = useState([]);



  useEffect(() => {
    setRowData(students);
  }, [students]);

  // tranceform the data with structured date based structured data

  const transformMarksData = (students) => {
    return students.map((student) => {
      const obj = {
        rollnumber: student.rollnumber,
        name: student.name,
      };

      student.marks.forEach((m) => {
        obj[m.test_id] = m.marks_obtained;
      });

      return obj;
    });
  };

  const getTests = (students) => {
    const map = new Map();

    students.forEach((student) => {
      student.marks.forEach((m) => {
        map.set(m.test_id, {
          test_id: m.test_id,
          exam_date: m.exam_date,
          max_marks: m.max_marks,
        });
      });
    });

    return Array.from(map.values()).sort(
      (a, b) => new Date(a.exam_date) - new Date(b.exam_date),
    );
  };

  const fetchMarksReport = async () => {
    try {
      if (!batch || !sectionn || !semester) {
        toast("Select batch, section and semester ⚠️");
        return;
      }

      const res = await getMarksReport(batch, sectionn, semester);

      const raw = res.data;

      const testsList = getTests(raw);
      const transformed = transformMarksData(raw);

      setTests(testsList);
      setRowData(transformed);
    } catch (err) {
      console.error(err);
      toast("Error fetching marks ❌");
    }
  };


  const colDefs = [
    { headerName: "Roll", field: "rollnumber", pinned: "left" },
    { headerName: "Name", field: "name", pinned: "left" },

    // 🔥 Total Column
    // {
    //   headerName: "Total",
    //   valueGetter: (params) => {
    //     return tests.reduce((sum, t) => {
    //       return sum + Number(params.data[t.test_id] || 0);
    //     }, 0);
    //   },
    //   cellStyle: { fontWeight: "bold" },
    // },

    // 🔥 Percentage Column
    {
      headerName: "Overall %",
      valueGetter: (params) => {
        const total = tests.reduce(
          (sum, t) => sum + Number(params.data[t.test_id] || 0),
          0,
        );

        const max = tests.reduce((sum, t) => sum + t.max_marks, 0);

        if (!max) return "0%";

        return ((total / max) * 100).toFixed(1) + "%";
      },

      cellStyle: (params) => {
        const value = parseFloat(params.value);

        if (value >= 75) return { color: "green", fontWeight: "bold" };
        if (value >= 50) return { color: "orange", fontWeight: "bold" };
        return { color: "red", fontWeight: "bold" };
      },
    },

    // 🔥 Dynamic Test Columns
    ...tests.map((test) => ({
      headerName: `${moment(test.exam_date).format("DD-MM")} (${test.max_marks})`,
      field: String(test.test_id),
      width: 100,
      cellStyle: { textAlign: "center" },
    })),
  ];
  
  return (
    <div>
      <h2 className="text-xl font-bold  my-4">
        Semester wise Marks Report
      </h2>
      <div className="flex justify-between my-2">
        <div>
          <Select
            defaultValue=""
            onValueChange={(value) => setsemester(value)}
            required
          >
            <SelectTrigger id="semester">
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
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
          <Button onClick={fetchMarksReport}>Apply Filter</Button>
        </div>
      </div>
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
    </div>
  );
}

export default MarksReport;
