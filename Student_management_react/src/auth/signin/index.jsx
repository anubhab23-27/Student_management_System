import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function SignInPage() {
  const { role } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    rollNumber: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          rollNumber: form.rollNumber,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Login success:", data);

        // store login info
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", role);

        // redirect
        if (role === "student") {
          navigate(`/student/${data.user.rollnumber}`);
        }
        if (role === "parent") {
          navigate(`/parent/${data.user.rollnumber}`);
        }

        if (role === "teacher") {
          navigate("/teacher");
        }
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] gap-4">
      <h1 className="text-2xl font-bold">{role.toUpperCase()} Login</h1>

      {/* 👇 Student + Parent */}
      {(role === "student" || role === "parent") && (
        <input
          type="number"
          name="rollNumber"
          placeholder="Enter Roll Number"
          value={form.rollNumber}
          onChange={handleChange}
          className="border p-2 rounded w-64"
        />
      )}

      {/* 👇 Teacher */}
      {role === "teacher" && (
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded w-64"
        />
      )}

      {/* Password */}
      <input
        type="password"
        name="password"
        placeholder="Enter Password"
        value={form.password}
        onChange={handleChange}
        className="border p-2 rounded w-64"
      />

      <button
        onClick={handleLogin}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </div>
  );
}

export default SignInPage;
