import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, User, Users } from "lucide-react";

function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      {/* Card */}
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-2">Welcome</h1>
        <p className="text-gray-500 mb-6">Select your role to continue</p>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <Link to="/login/teacher">
            <Button className="w-full flex items-center gap-2 justify-center text-lg py-6">
              <GraduationCap size={18} />
              Log in as Teacher
            </Button>
          </Link>

          <Link to="/login/student">
            <Button
              variant="secondary"
              className="w-full flex items-center gap-2 justify-center text-lg py-6"
            >
              <User size={18} />
              Log in as Student
            </Button>
          </Link>

          <Link to="/login/parent">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 justify-center text-lg py-6 hover:bg-gray-100"
            >
              <Users size={18} />
              Log in as Parent
            </Button>
          </Link>
        </div>
      </div>



      
    </div>
  );
}

export default LoginPage;
