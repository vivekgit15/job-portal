import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../lib/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Applicants() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await API.get(`/applications/job/${jobId}`);
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchApplicants();
  }, [jobId]);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1120] to-[#05080f]" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.04]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,255,120,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_70%)]" />

      {/* CONTENT WRAPPER */}
      <div className="relative z-10 px-6 pt-28 pb-20 max-w-5xl mx-auto">

        <h1 className="text-4xl font-extrabold mb-8">Applicants</h1>

        {/* EMPTY STATE */}
        {applications.length === 0 && (
          <div className="bg-[#0d1522]/70 backdrop-blur-xl p-8 rounded-xl border border-white/10 text-center shadow-md">
            <p className="text-gray-400 text-lg">No one has applied for this job yet.</p>
          </div>
        )}

        {/* APPLICANT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <Card
              key={app._id}
              className="bg-[#0d1522]/80 backdrop-blur-lg border border-white/10 rounded-xl 
              hover:border-green-500/30 hover:shadow-[0_0_22px_rgba(0,255,120,0.15)]
              transition-all"
            >
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <span className="text-green-400 text-xl">👤</span>
                  {app.applicant?.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="text-gray-300">

                <p className="mb-1">
                  <strong className="text-white">Email:</strong> {app.applicant?.email}
                </p>

                <p className="mb-1">
                  <strong className="text-white">Applied For:</strong> {app.job?.title}
                </p>

                <p className="mb-1">
                  <strong className="text-white">Location:</strong> {app.job?.location}
                </p>

                <p className="mb-1">
                  <strong className="text-white">Salary:</strong> {app.job?.salary}
                </p>

                {/* STATUS BADGE */}
                <p className="mb-1 flex items-center">
                  <strong className="text-white">Status:</strong>

                  <span
                    className={`ml-2 px-2 py-1 rounded text-xs capitalize ${
                      app.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-600/30"
                        : app.status === "accepted"
                        ? "bg-green-500/20 text-green-400 border border-green-600/30"
                        : "bg-red-500/20 text-red-400 border border-red-600/30"
                    }`}
                  >
                    {app.status}
                  </span>
                </p>

                <p className="text-gray-400 text-sm mt-3 flex items-center gap-2">
                  <span className="text-green-400">📅</span>
                  Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                </p>

              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
