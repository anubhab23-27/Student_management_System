import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
const AtomIcon = ({ size = 24, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="2" fill={color} />
    <ellipse cx="12" cy="12" rx="10" ry="4" />
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
  </svg>
);

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  };

  const firstLetter = user?.name?.charAt(0)?.toUpperCase();

  // Helper to generate nav link classes
  const navLinkClass = (path) =>
    `transition-colors duration-150 font-medium pb-0.5 ${
      location.pathname === path
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-600 hover:text-blue-500"
    }`;

  return (
    <div className="p-2.5 px-7 flex items-center justify-between shadow-md relative">
      {/* LEFT */}
      <Link to="/home">
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-9 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center shadow-md shadow-blue-200">
            <AtomIcon size={20} color="white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-900 leading-none">
              ChemWise
            </p>
            <p className="text-[10px] text-teal-600 font-medium tracking-wide uppercase leading-none mt-0.5">
              Coaching Centre
            </p>
          </div>
        </div>
      </Link>

      {/* RIGHT */}
      <div className="flex items-center gap-6">
        {/* If not logged in */}
        {(!user || location.pathname === "/home") && (
          <Link to="/" className={navLinkClass("/")}>
            Login
          </Link>
        )}
        {!user && (
          <Link to="/home" className={navLinkClass("/home")}>
            Home
          </Link>
        )}

        {/* If logged in */}
        {user && location.pathname !== "/home" && (
          <div className="relative">
            <Popover>
              <PopoverTrigger>
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer">
                  {firstLetter}
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverHeader>
                  <PopoverTitle>{user.name}</PopoverTitle>
                </PopoverHeader>
                {(role === "student" || role === "parent") && (
                  <>
                    <p className="text-sm text-gray-500">
                      Roll: {user.rollnumber}
                    </p>
                    <p className="text-sm text-gray-500">Batch: {user.batch}</p>
                    <p className="text-sm text-gray-500">
                      Section: {user.sectionn}
                    </p>
                  </>
                )}
                {role === "teacher" && (
                  <p className="text-sm text-gray-500">{user.email}</p>
                )}
                <Button
                  onClick={handleLogout}
                  className="mt-3 w-full bg-red-700 text-white py-1 rounded hover:bg-red-600"
                >
                  Logout
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
