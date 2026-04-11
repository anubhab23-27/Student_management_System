import { useEffect, useState } from "react";
import {
  getStudentByRoll,
  getStudentMarks,
} from "../../../../service/GlobalApi";
import moment from "moment";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { AgGridProvider, AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
const modules = [AllCommunityModule];

function ViewMarks() {
  const [studentId, setStudentId] = useState(null);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const rollnumber = user?.rollnumber;
  const [selectedSemester, setSelectedSemester] = useState("1");
  const semesters = [...new Set(marks.map((m) => m.semester))];

  // ✅ STEP 1 — get studentId
  useEffect(() => {
    if (!rollnumber) return;

    const fetchStudentId = async () => {
      try {
        const res = await getStudentByRoll(rollnumber);
        setStudentId(res.data.id);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudentId();
  }, [rollnumber]);

  // ✅ STEP 2 — get marks using studentId
  useEffect(() => {
    if (!studentId) return;

    const fetchMarks = async () => {
      try {
        const res = await getStudentMarks(studentId);
        setMarks(res.data || []);
      } catch (err) {
        console.error(err);
        setMarks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMarks();
  }, [studentId]);

  if (loading) return <div>Loading...</div>;
  const filteredMarks =
    selectedSemester === "all"
      ? marks
      : marks.filter((m) => String(m.semester) === selectedSemester);
  const totalMarks = filteredMarks.reduce(
    (sum, m) => sum + Number(m.max_marks),
    0,
  );

  const obtainedMarks = filteredMarks.reduce(
    (sum, m) => sum + Number(m.marks_obtained),
    0,
  );

  const overallPercent =
    totalMarks > 0 ? ((obtainedMarks / totalMarks) * 100).toFixed(2) : 0;

  const columnDefs = [
    { headerName: "Semester", field: "semester", flex: 1 },

    { headerName: "Exam", field: "exam_number", flex: 1 },

    {
      headerName: "Date",
      field: "exam_date",
      flex: 1,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString("en-GB");
      },
    },

    {
      headerName: "Max",
      field: "max_marks",
      flex: 1,
    },

    {
      headerName: "Marks",
      field: "marks_obtained",
      flex: 1,
    },

    {
      headerName: "Percentage %",
      flex: 1,
      valueGetter: (params) => {
        const obtained = Number(params.data.marks_obtained);
        const max = params.data.max_marks;
        return ((obtained / max) * 100).toFixed(1);
      },
      cellStyle: (params) => {
        const val = Number(params.value);
        if (val < 40) return { color: "red", fontWeight: "bold" };
        if (val > 75) return { color: "green", fontWeight: "bold" };
        return {};
      },
    },
  ];

  const chartData = marks
    .map((m, index) => {
      const percent = (Number(m.marks_obtained) / Number(m.max_marks)) * 100;

      return {
        id: index, // ✅ unique key
        rawDate: new Date(m.exam_date),
        date: moment(m.exam_date).format("DD MMM"),
        fullLabel: `${moment(m.exam_date).format("DD MMM")} (T${m.exam_number})`,
        percent: Number(percent.toFixed(1)),
        semester: m.semester,
        exam: m.exam_number,
      };
    })
    .sort((a, b) => a.rawDate - b.rawDate);

  return (
    <div className="px-4 ">
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold my-4">Semester Marks</h2>

          <Select
            defaultValue=""
            onValueChange={(value) => setSelectedSemester(value)}
            required
          >
            <SelectTrigger id="semester">
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            {/* <SelectContent>
          <SelectGroup>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
            
          </SelectGroup>
        </SelectContent> */}
            <SelectContent>
              {semesters.map((sem) => (
                <SelectItem key={sem} value={String(sem)}>
                  Semester {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Summary Cards */}

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-gray-100 text-center">
            <div className="text-sm text-gray-600">Total Marks</div>
            <div className="text-xl font-bold">{totalMarks}</div>
          </div>
          <div className="p-4 rounded-lg bg-blue-100 text-center">
            <div className="text-sm text-blue-700">Obtained</div>
            <div className="text-xl font-bold text-blue-800">
              {obtainedMarks}
            </div>
          </div>
          <div
            className={`p-4 rounded-lg text-center ${
              overallPercent < 40 ? "bg-red-100" : "bg-green-100"
            }`}
          >
            <div
              className={`text-sm ${
                overallPercent < 40 ? "text-red-700" : "text-green-700"
              }`}
            >
              Overall %
            </div>

            <div
              className={`text-xl font-bold ${
                overallPercent < 40 ? "text-red-800" : "text-green-800"
              }`}
            >
              {overallPercent}%
            </div>
          </div>
        </div>
      </div>
      {filteredMarks.length === 0 ? (
        <p>No data</p>
      ) : (
        <>
          <AgGridProvider modules={modules}>
            <div
              className="ag-theme-alpine"
              style={{ height: 170, width: "100%" }}
            >
              <AgGridReact rowData={filteredMarks} columnDefs={columnDefs} />
            </div>
          </AgGridProvider>
        </>
      )}
      <div className="w-full h-69 mt-6 bg-white p-7 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Performance Trend</h3>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="rawDate"
              tickFormatter={(val) => moment(val).format("DD MMM YYYY")}
            />
            <YAxis domain={[0, 100]} />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;

                  return (
                    <div className="bg-white p-3 border rounded shadow text-sm">
                      <p className="font-semibold">{data.date}</p>
                      <p className="text-gray-600">
                        Semester {data.semester} | Test {data.exam}
                      </p>
                      <p className="text-blue-600 font-bold">{data.percent}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Line
              type="monotone"
              dataKey="percent"
              stroke="#3b82f6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ViewMarks;
