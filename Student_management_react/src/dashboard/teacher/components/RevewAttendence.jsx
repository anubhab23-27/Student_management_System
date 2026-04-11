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
  getMonthlyAttendance,
} from "../../../../service/GlobalApi";

function RevewAttendence() {
  const [students, setStudents] = useState([]);
  const [rowData, setRowData] = useState();
  const [batch, setbatch] = useState("");
  const [sectionn, setsectionn] = useState("");
  const [reportDates, setReportDates] = useState([]);

  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  };
  const [month, setMonth] = useState(getCurrentMonth());

  const calculatePercentage = (student, dates) => {
    if (!student || dates.length === 0) return "0%";

    let presentCount = 0;

    dates.forEach((date) => {
      if (student[date] === true) {
        presentCount++;
      }
    });

    const percent = (presentCount / dates.length) * 100;

    return percent.toFixed(1) + "%";
  };

  const fetchStudents = async () => {
    try {
      const res = await getFilteredStudents(batch, sectionn);

      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setRowData(students);
  }, [students]);

  // tranceform the data with structured date based structured data

  const transformData = (data) => {
    const map = {};

    data.forEach((row) => {
      if (!map[row.id]) {
        map[row.id] = {
          rollnumber: row.rollnumber,
          name: row.name,
        };
      }

      if (row.date) {
        map[row.id][row.date] = row.present;
      }
    });

    return Object.values(map);
  };

  // get the unique dates
  const getDates = (data) => {
    const set = new Set();

    data.forEach((row) => {
      if (row.date) {
        set.add(row.date);
      }
    });

    return Array.from(set).sort();
  };

  // get monthly attendence report
  const fetchMonthlyReport = async () => {
    try {
      if (!batch || !sectionn || !month) {
        toast("Select batch, section and month ⚠️");
        return;
      }

      const res = await getMonthlyAttendance(batch, sectionn, month);

      console.log("API DATA:", res.data);

      const raw = res.data;

      const dates = getDates(raw);
      const transformed = transformData(raw);

      console.log("Dates:", dates);
      console.log("Rows:", transformed);

      setReportDates(dates);
      setRowData(transformed);
    } catch (err) {
      console.error(err);
      toast("Error fetching report ❌");
    }
  };

  const colDefs = [
    { headerName: "Roll", field: "rollnumber", pinned: "left" },
    { headerName: "Name", field: "name", pinned: "left" },


    // percentage column
    {
      headerName: "%",
      width: 100,
      valueGetter: (params) => calculatePercentage(params.data, reportDates),

      cellStyle: (params) => {
        if (!params.value) return;

        const value = parseFloat(params.value); // "66.7%" → 66.7

        if (value >= 75)
          return {
            color: "green",
            fontWeight: "bold",
            backgroundColor: "#e6ffe6",
          };

        if (value >= 50) return {
          color: "orange",
          fontWeight: "bold",
          backgroundColor: "#fff4e6",
        };

        return { color: "red", fontWeight: "bold", backgroundColor: "#ffe6e6" };
      },
    },

    //dynamic date column
    ...reportDates.map((date) => ({
      headerName: date.split("-")[2],
      field: date,
      width: 70,
      cellRenderer: (params) => {
        if (params.value === true) return "✔️";
        if (params.value === false) return "❌";
        return "-";
      },
    })),
  ];

  const handleApplyFilter = async () => {
    // await fetchStudents();
    await fetchMonthlyReport();
  };
  return (
    <div>
      <h2 className="text-xl font-bold  my-4">Monthly Attendance Report</h2>
      <div className="flex justify-between my-2">
        <div>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border px-3 py-2 rounded-md flex items-center "
          />
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
          <Button onClick={handleApplyFilter}>Apply Filter</Button>
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
      {/* <Button onClick={fetchMonthlyReport}>Load Report</Button> */}
    </div>
  );
}

export default RevewAttendence;
