import { useState } from "react";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/custom/Navbar";
import ParentsDashboard from "./pages/parentsDashboard";
import Home from "./pages/Home";
import SignInPage from "./auth/signin";
import ProtectedRoute from "./auth/ProtectedRoute";
import ExamPreview from "./dashboard/teacher/components/ExamPreview";
import ExamPortal from "./dashboard/student/components/ExamPortal";

// Extracted into its own component so useLocation can be used
function AppContent() {
  const location = useLocation();

  // Hide Navbar on exam portal route
  const hideNavbar = location.pathname.startsWith("/student/exam/");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {/* Login Pages */}
        <Route path="/login/:role" element={<SignInPage />} />

        {/* Dashboards */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/teacher/exam/preview" element={<ExamPreview />} />

        <Route
          path="/student/:rollnumber"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/student/exam/:examId" element={<ExamPortal />} />

        <Route
          path="/parent/:rollnumber"
          element={
            <ProtectedRoute allowedRole="parent">
              <ParentsDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
