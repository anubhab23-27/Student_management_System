import React from "react";

function ParentsDashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Parent Dashboard</h1>

      <p>Viewing student:</p>

      <p>
        <b>Name:</b> {user.name}
      </p>
      <p>
        <b>Roll Number:</b> {user.rollnumber}
      </p>
    </div>
  );
}

export default ParentsDashboard;
