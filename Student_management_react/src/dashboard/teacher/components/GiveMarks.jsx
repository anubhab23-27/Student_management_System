import React, { useEffect, useMemo, useState } from "react";
import {
  getAttendance,
  getFilteredStudents,
  saveAttendance,
  saveMarks,
} from "../../../../service/GlobalApi";
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
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function GiveMarks() {
  const [batch, setbatch] = useState("");
  const [sectionn, setsectionn] = useState("");
  const [semester, setsemester] = useState("");
  const [testNo, settestNo] = useState("");
  const [students, setStudents] = useState([]);
  const [rowData, setRowData] = useState();
  const [date, setDate] = useState(new Date());
  const [maxMarks, setmaxMarks] = useState(25);

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

  const CustomMarksInput = (props) => {
    const { maxMarks } = props;

    const [inputValue, setInputValue] = useState(props.value ?? "");

    // sync when grid updates externally
    useEffect(() => {
      setInputValue(props.value ?? "");
    }, [props.value]);

    const isInvalidMarks =
      inputValue !== "" &&
      (Number(inputValue) < 0 || Number(inputValue) > maxMarks);

    const handleChange = (e) => {
      const val = e.target.value;

      // update local input first (IMPORTANT)
      setInputValue(val);

      // then update grid
      if (val === "") {
        props.node.setDataValue("marks_obtained", "");
      } else {
        props.node.setDataValue("marks_obtained", Number(val));
      }
    };

    return (
      <input
        type="number"
        value={inputValue}
        onChange={handleChange}
        className={`w-20 text-center border rounded px-1 
      ${isInvalidMarks ? "bg-red-100 text-red-600 border-red-400" : "bg-white"}
    `}
      />
    );
  };

  const colDefs = useMemo(
    () => [
      { field: "batch" },
      { field: "sectionn" },
      { field: "phone" },
      { field: "rollnumber" },
      { field: "name", filter: true },
      {
        field: "marks_obtained",
        headerName: "Marks Obtained",
        cellRenderer: (props) => (
          <CustomMarksInput {...props} maxMarks={maxMarks} />
        ),
      },
    ],
    [maxMarks],
  );

  // save the GiveMarks data in db
  const handleSaveMarks = async () => {
    try {
      if (!batch || !sectionn || !rowData?.length) {
        toast("Please select batch, section and load students ⚠️");
        return;
      }

      const formattedDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      const marksData = rowData.map((student) => ({
        student_id: student.id,
        marks_obtained: Number(student.marks_obtained || 0),
        max_marks: maxMarks,
        semester: Number(semester.replace("Semester-", "")),
        exam_number: Number(testNo.replace("Test", "")),
      }));

      const payload = {
        exam_date: formattedDate,
        batch,
        sectionn,
        marks: marksData,
      };

      console.log("Sending marks payload:", payload);

      await saveMarks(payload);

      toast("Marks saved successfully ✅");
    } catch (err) {
      console.error(err);
      toast("Error saving marks ❌");
    }
  };

  // auto load GiveMarks data with respect to date

  useEffect(() => {
    setRowData([]);
  }, [batch, sectionn]);

  return (
    <div>
      <h2 className="text-xl font-bold  my-4">Give Exam Marks</h2>
      <div className="flex justify-between my-2">
        <div className="flex items-center gap-7">
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
                <SelectItem value="Semester-1">Semester-1</SelectItem>
                <SelectItem value="Semester-2">Semester-2</SelectItem>
                <SelectItem value="Semester-3">Semester-3</SelectItem>
                <SelectItem value="Semester-4">Semester-4</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            defaultValue=""
            onValueChange={(value) => settestNo(value)}
            required
          >
            <SelectTrigger id="exam_number">
              <SelectValue placeholder="Test no." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Test1">Test-1</SelectItem>
                <SelectItem value="Test2">Test-2</SelectItem>
                <SelectItem value="Test3">Test-3</SelectItem>
                <SelectItem value="Test4">Test-4</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div>
            <div className="mx-auto grid w-full max-w-xs gap-3">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="slider-demo-temperature">Maximum Marks</Label>
                <span className="text-sm text-muted-foreground">
                  {maxMarks}
                </span>
              </div>
              <Slider
                id="slider-maxMarks"
                value={maxMarks}
                onValueChange={setmaxMarks}
                min={0}
                max={100}
                step={1}
              />
            </div>
          </div>
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
          <Button
            disabled={!batch || !sectionn || !semester || !testNo}
            onClick={() => fetchStudents()}
          >
            Apply Filter
          </Button>
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
        onClick={handleSaveMarks}
        disabled={!batch || !sectionn || !rowData?.length}
        className="mt-4"
      >
        Save Marks
      </Button>
    </div>
  );
}

export default GiveMarks;
