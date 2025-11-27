import React from 'react'
import JobseekerDashboard from "./JobseekerDashboard";
import EmployerDashboard from "./EmployerDashboard";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return null; // safety

  return user.role === "employer"
    ? <EmployerDashboard />
    : <JobseekerDashboard />;
}
