import { useEffect, useState } from "react";
import API from "../lib/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function JobseekerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const all = await API.get("/jobs");
        setJobs(all.data);

        const applied = await API.get("/applications/my");
        const appliedIds = applied.data.map((a) => a.job._id);
        setAppliedJobIds(appliedIds);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    return (
      job.title.toLowerCase().includes(search.toLowerCase()) &&
      (locationFilter ? job.location.toLowerCase().includes(locationFilter.toLowerCase()) : true) &&
      (typeFilter ? job.employmentType === typeFilter : true)
    );
  });

  return (
    <div className="relative min-h-screen text-white">

      {/* ==== Dark Global Background ==== */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1120] to-[#05080f]" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.04]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,255,120,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_70%)]" />

      <div className="relative z-10 px-6 pt-28 pb-12 max-w-6xl mx-auto">

        {/* ================= Page Title ================= */}
        <h1 className="text-4xl font-extrabold mb-10">Find Your Next Job</h1>

        {/* ================= Filters Section ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          {/* Search Job Title */}
          <div>
            <label className="text-gray-300 mb-2 block">Search Job</label>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by job title"
              className="bg-white/10 text-white border-white/20"
            />
          </div>

          {/* Filter by Location */}
          <div>
            <label className="text-gray-300 mb-2 block">Location</label>
            <Input
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="Filter by location"
              className="bg-white/10 text-white border-white/20"
            />
          </div>

          {/* Filter by Job Type */}
          <div>
            <label className="text-gray-300 mb-2 block">Employment Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full h-10 rounded-md bg-white/10 text-white border border-white/20 px-2"
            >
              <option value="">All</option>
              <option value="Full-time" className="text-black">Full-time</option>
              <option value="Part-time" className="text-black">Part-time</option>
              <option value="Internship" className="text-black">Internship</option>
            </select>
          </div>

        </div>

        {/* ================= FILTERED JOBS ================= */}
        <h2 className="text-2xl font-semibold mb-6">Latest Jobs</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <Card
              key={job._id}
              className="bg-[#0d1522]/80 backdrop-blur-lg border border-white/10 rounded-xl
                         hover:border-green-500/30 hover:shadow-[0_0_20px_rgba(0,255,120,0.15)]
                         transition-all cursor-pointer"
            >
              <CardHeader>
                <CardTitle className="text-white">{job.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-gray-400 text-sm mb-1">
                  <strong className="text-white">Company:</strong> {job.postedBy?.name}
                </p>

                <p className="text-gray-400 text-sm mb-1">
                  <strong className="text-white">Location:</strong> {job.location}
                </p>

                <p className="text-gray-400 text-sm mb-1">
                  <strong className="text-white">Salary:</strong> {job.salary || "Not specified"}
                </p>

                <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                  {job.description}
                </p>
            <span className="flex gap-3">
                <Button
                  className="mt-4 w-1/6  bg-green-500 hover:bg-green-600 text-black font-semibold"
                  onClick={() => navigate(`/job/${job._id}`)}
                  disabled={appliedJobIds.includes(job._id)}
                >
                  {appliedJobIds.includes(job._id) ? "Applied" : "View Details"}
                </Button>
                <Button
                  className="mt-4 w-1/5 md: w-1/4 bg-green-500 hover:bg-green-600 text-black font-semibold"
                  onClick={() => navigate(`/job/${job._id}`)}
                  
                >View Details
                </Button>
                </span>
                
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ================= ADDITIONAL SECTIONS ================= */}

        {/* Recommended Jobs */}
        <h2 className="text-2xl font-semibold mt-16 mb-6">Recommended Jobs</h2>
        <p className="text-gray-400 mb-4">Based on your recent activity.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.slice(0, 2).map((job) => (
            <Card
              key={job._id + "-rec"}
              className="bg-[#0d1522]/80 backdrop-blur-lg border border-white/10 rounded-xl"
            >
              <CardHeader>
                <CardTitle className="text-white">{job.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">{job.location}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* High Salary Jobs */}
        <h2 className="text-2xl font-semibold mt-16 mb-6">High Salary Jobs</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs
            .filter((j) => parseInt(j.salary) > 50000)
            .slice(0, 2)
            .map((job) => (
              <Card
                key={job._id + "-salary"}
                className="bg-[#0d1522]/80 backdrop-blur-lg border border-white/10 rounded-xl"
              >
                <CardHeader>
                  <CardTitle className="text-white">{job.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-400 font-bold">{job.salary}</p>
                </CardContent>
              </Card>
            ))}
        </div>

      </div>
    </div>
  );
}
