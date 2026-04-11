
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

function Navbar() {
  return (
    <div className="p-3 px-10 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-1">
        <span className="text-lg font-semibold">Student-manager</span>
      </div>
      <div className="flex items-center gap-8">
        <a href="/">Log in</a>
        <a href="/home">Home</a>
      </div>
    </div>
  );
}

export default Navbar;
