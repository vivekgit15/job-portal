import { useEffect, useState } from "react";
import API from "../lib/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get("/applications/my");
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      {/* Global Dark Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1120] to-[#05080f] " />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.04]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,255,120,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_70%)]" />

      <div className="relative z-10 px-6 pt-28 pb-20 max-w-6xl mx-auto">

        {/* Title */}
        <h1 className="text-4xl font-extrabold mb-8">My Applications</h1>

        {/* Empty State */}
        {applications.length === 0 && (
          <div className="bg-[#0d1522]/70 backdrop-blur-lg p-8 rounded-xl border border-white/10 text-center shadow-md">
            <p className="text-gray-400 text-lg">You haven’t applied to any jobs yet.</p>
          </div>
        )}

        {/* Application Cards */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {applications.map((app) => (
            <Card
              key={app._id}
              className="bg-[#0d1522]/80 backdrop-blur-lg border border-white/10 rounded-xl 
              hover:border-green-500/30 hover:shadow-[0_0_20px_rgba(0,255,120,0.15)]
              transition-all"
            >
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <span className="text-green-400 text-xl">💼</span>
                  {app.job?.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="text-gray-300">
                
                <p className="mb-1">
                  <strong className="text-white">Company:</strong> {app.employer?.name}
                </p>

                <p className="mb-1">
                  <strong className="text-white">Location:</strong> {app.job?.location}
                </p>

                <p className="mb-1">
                  <strong className="text-white">Salary:</strong> {app.job?.salary}
                </p>

                {/* Status Badge */}
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

                {/* Applied Date */}
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
