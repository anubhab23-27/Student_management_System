import { useEffect, useState } from "react";
import {
  getStudentByRoll,
  getStudentMarks,
} from "../../../../service/GlobalApi";
import moment from "moment";
import {
  Select,
  SelectContent,
  SelectItem,
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
import { AllCommunityModule } from "ag-grid-community";
const modules = [AllCommunityModule];

function ViewMarks() {
  const [studentId, setStudentId] = useState(null);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const rollnumber = user?.rollnumber;
  const [selectedSemester, setSelectedSemester] = useState("1");
  const semesters = [...new Set(marks.map((m) => m.semester))];

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
    { headerName: "Sem", field: "semester", flex: 1 },
    { headerName: "Exam", field: "exam_number", flex: 1 },
    {
      headerName: "Date",
      field: "exam_date",
      ...(window.innerWidth < 640 ? { width: 120 } : { flex: 1 }),
      valueFormatter: (params) =>
        new Date(params.value).toLocaleDateString("en-GB"),
    },
    { headerName: "Max", field: "max_marks", flex: 1 },
    { headerName: "Marks", field: "marks_obtained", flex: 1 },
    {
      headerName: "%",
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
        id: index,
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
    <div className="px-2 sm:px-2 pb-20 sm:pb-0">
      {/* ── Header row: stacks on mobile, side-by-side on sm+ ── */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold my-2">Semester Marks</h2>
          <Select
            defaultValue=""
            onValueChange={(value) => setSelectedSemester(value)}
            required
          >
            <SelectTrigger id="semester" className="w-40">
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              {semesters.map((sem) => (
                <SelectItem key={sem} value={String(sem)}>
                  Semester {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards — full width on mobile, auto on sm+ */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="p-3 sm:p-4 rounded-lg bg-gray-100 text-center">
            <div className="text-xs sm:text-sm text-gray-600">Total</div>
            <div className="text-lg sm:text-xl font-bold">{totalMarks}</div>
          </div>
          <div className="p-3 sm:p-4 rounded-lg bg-blue-100 text-center">
            <div className="text-xs sm:text-sm text-blue-700">Obtained</div>
            <div className="text-lg sm:text-xl font-bold text-blue-800">
              {obtainedMarks}
            </div>
          </div>
          <div
            className={`p-3 sm:p-4 rounded-lg text-center ${
              overallPercent < 40 ? "bg-red-100" : "bg-green-100"
            }`}
          >
            <div
              className={`text-xs sm:text-sm ${
                overallPercent < 40 ? "text-red-700" : "text-green-700"
              }`}
            >
              Overall %
            </div>
            <div
              className={`text-lg sm:text-xl font-bold ${
                overallPercent < 40 ? "text-red-800" : "text-green-800"
              }`}
            >
              {overallPercent}%
            </div>
          </div>
        </div>
      </div>

      {/* AG Grid */}
      {filteredMarks.length === 0 ? (
        <p>No data</p>
      ) : (
        <div className="overflow-x-auto w-full">
          <AgGridProvider modules={modules}>
            <div
              className="ag-theme-alpine"
              style={{ height: 170, minWidth: 520, width: "100%" }}
            >
              <AgGridReact
                rowData={filteredMarks}
                columnDefs={columnDefs}
                suppressSizeColumnsToFit={true}
              />
            </div>
          </AgGridProvider>
        </div>
      )}

      {/* Chart — taller on mobile so it's readable */}
      {/* Chart */}
      <div className="w-full mt-3 bg-white p-4 sm:p-7 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Performance Trend</h3>

        {/* Scrollable wrapper */}
        <div className="overflow-x-auto">
          <div
            style={{
              height: 220,
              minWidth: "100%",
              width: Math.max(chartData.length * 80, 300), // 80px per point, min 300px
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="rawDate"
                  tickFormatter={(val) =>
                    window.innerWidth < 640
                      ? moment(val).format("DD/MM")
                      : moment(val).format("DD MMM YYYY")
                  }
                  tick={{ fontSize: 11 }}
                />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} width={32} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded shadow text-sm">
                          <p className="font-semibold">{data.date}</p>
                          <p className="text-gray-600">
                            Sem {data.semester} | Test {data.exam}
                          </p>
                          <p className="text-blue-600 font-bold">
                            {data.percent}%
                          </p>
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
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewMarks;
