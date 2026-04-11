import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// create axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// ================= STUDENT APIs =================

// GET all students
export const getStudents = () => api.get("/students");

// ADD student
export const addStudent = (data) => api.post("/students", data);

// DELETE student
export const deleteStudent = (id) => api.delete(`/students/${id}`
);


// UPDATE student
export const updateStudent = (id, data) => api.put(`/students/${id}`, data);

//Filtered Student
export const getFilteredStudents = (batch, sectionn) =>
  api.get("/students/filtered", {
    params: { batch, sectionn },
  });


// POST Attendence
  export const saveAttendance = (data) => {
    return api.post("/attendance", data);
};
// GET attendence
export const getAttendance = (date, batch, sectionn) => {
  return api.get("/attendance", {
    params: { date, batch, sectionn },
  });
};

export const getMonthlyAttendance = (batch, sectionn, month) => {
  return api.get("/attendance/report", {
    params: { batch, sectionn, month },
  });
};


// Marks
export const saveMarks = (data) => {
  return api.post("/marks", data);
};

export const getMarksReport = (batch, sectionn, semester) => {
  return api.get("/marks/marksReport", {
    params: { batch, sectionn, semester },
  });
};

export const getStudentAttendance = (studentId, month) => {
  return api.get(`/attendance/student/${studentId}?month=${month}`);
};

export const getStudentByRoll = (roll) => {
  return api.get(`/students/by-roll/${roll}`);
};

// GET marks of a single student
export const getStudentMarks = (studentId) => {
  return api.get(`/marks/${studentId}`);
};


export default api;
