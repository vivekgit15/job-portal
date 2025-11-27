import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../lib/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salary: "",
    employmentType: "Full-time",
  });


  const [jobs, setJobs] = useState([]);

  // Fetch employer's own jobs
  useEffect(() => {
    const fetchMyJobs = async () => {
      const res = await API.get("/jobs");
      const myJobs = res.data.filter((job) => job.postedBy?._id === user.id);
      setJobs(myJobs);
    };

    fetchMyJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      await API.delete(`/jobs/${id}`);
      setJobs(jobs.filter((job) => job._id !== id));
      alert("Job deleted successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      {/* Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1120] to-[#05080f]" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.04]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,255,120,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_70%)]" />

      {/* CONTENT */}
      <div className="relative z-10 px-6 pt-28 pb-20 max-w-5xl mx-auto">

        {/* Page Title */}
        <h1 className="text-4xl font-extrabold mb-10">Employer Dashboard</h1>

        {/* ==================== POST JOB FORM (Glass) ==================== */}
        
        {/* ==================== POSTED JOBS LIST ==================== */}
        <h2 className="text-3xl font-bold mt-16 mb-6">Your Posted Jobs</h2>

        {jobs.length === 0 && (
          <p className="text-gray-400">You haven’t posted any jobs yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <Card
              key={job._id}
              className="bg-[#0d1522]/80 backdrop-blur-lg border border-white/10 rounded-xl
              hover:border-green-500/30 hover:shadow-[0_0_20px_rgba(0,255,120,0.15)] transition-all"
            >
              <CardHeader>
                <CardTitle className="text-white flex justify-between items-center">
                  {job.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="text-gray-300">
                <p><strong className="text-white">Location:</strong> {job.location}</p>
                <p><strong className="text-white">Salary:</strong> {job.salary}</p>

                <div className="flex gap-2 mt-4">
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-black"
                    onClick={() => navigate(`/job/${job._id}`)}
                  >
                    View Details
                  </Button>

                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => navigate(`/employer/job/${job._id}/applicants`)}
                  >
                    Applicants
                  </Button>

                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => handleDelete(job._id)}
                  >
                    Delete
                  </Button>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
