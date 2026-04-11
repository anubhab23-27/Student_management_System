import { useState } from "react";

import "./App.css";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/custom/Navbar";
import ParentsDashboard from "./pages/parentsDashboard";
import Home from "./pages/Home";
import SignInPage from "./auth/signin";
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
  const [count, setCount] = useState(0);
  
  return (
    <>
      <Navbar />
      <BrowserRouter>
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

          <Route
            path="/student/:rollnumber"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

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
      </BrowserRouter>
    </>
  );
}

export default App;
