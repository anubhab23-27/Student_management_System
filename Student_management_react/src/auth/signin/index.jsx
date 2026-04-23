import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, User, Users } from "lucide-react";

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
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", role);

        if (role === "student") navigate(`/student/${data.user.rollnumber}`);
        if (role === "parent") navigate(`/parent/${data.user.rollnumber}`);
        if (role === "teacher") navigate("/teacher");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // role icon
  const getIcon = () => {
    if (role === "teacher") return <GraduationCap size={22} />;
    if (role === "student") return <User size={22} />;
    return <Users size={22} />;
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      {/* Card */}
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="mb-2">{getIcon()}</div>
          <h1 className="text-2xl font-bold capitalize">{role} Login</h1>
          <p className="text-gray-500 text-sm">
            Enter your credentials to continue
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          {/* Student / Parent */}
          {(role === "student" || role === "parent") && (
            <Input
              type="number"
              name="rollNumber"
              placeholder="Enter Roll Number"
              value={form.rollNumber}
              onChange={handleChange}
            />
          )}

          {/* Teacher */}
          {role === "teacher" && (
            <Input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={form.email}
              onChange={handleChange}
            />
          )}

          {/* Password */}
          <Input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
          />

          {/* Button */}
          <Button onClick={handleLogin} className="w-full text-lg py-6 mt-2">
            Login
          </Button>
        </div>
      </div>



      
    </div>
  );
}

export default SignInPage;
