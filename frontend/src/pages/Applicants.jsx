import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../lib/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Applicants() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);

  // =============== UPDATE STATUS ==================
  const updateStatus = async (applicationId, status) => {
    try {
      const res = await API.put(`/applications/status/${applicationId}`, {
        status,
      });

      // Update UI without reloading the page
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status } : app
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Error updating status");
    }
  };

  // =============== FETCH APPLICANTS ==================
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

      {/* CONTENT */}
      <div className="relative z-10 px-6 pt-28 pb-20 max-w-5xl mx-auto">

        <h1 className="text-4xl font-extrabold mb-8">Applicants</h1>

        {/* EMPTY STATE */}
        {applications.length === 0 && (
          <Card className="bg-[#0d1522]/70 backdrop-blur-xl p-8 rounded-xl border border-white/10 text-center">
            <p className="text-gray-400 text-lg">No one has applied yet.</p>
          </Card>
        )}

        {/* APPLICANTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <Card
              key={app._id}
              className="bg-[#0d1522]/80 backdrop-blur-lg border border-white/10 rounded-xl 
              hover:border-green-500/30 transition-all"
            >
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <img
                    src={
                      app.applicant?.profilePhoto ||
                      "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    }
                    className="w-12 h-12 rounded-full border border-white/20 object-cover"
                  />
                  {app.applicant?.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="text-gray-300">

                <p className="mb-1">
                  <strong className="text-white">Email:</strong>{" "}
                  {app.applicant?.email}
                </p>

                <p className="mb-1">
                  <strong className="text-white">Job:</strong> {app.job?.title}
                </p>

                {/* RESUME DOWNLOAD */}
                <div className="mt-3">
                  {app.resume ? (
                    <a
                      href={app.resume}
                      download
                      target="_blank"
                      className="text-green-400 underline hover:text-green-300"
                    >
                      📄 Download Resume
                    </a>
                  ) : (
                    <p className="text-gray-500">No Resume Provided</p>
                  )}
                </div>

                {/* STATUS BADGE */}
                <p className="mt-3">
                  <strong className="text-white">Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs capitalize ${
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

                {/* ACTION BUTTONS */}
                <div className="flex gap-3 mt-4">

                  {/* ACCEPT */}
                  <button
                    onClick={() => updateStatus(app._id, "accepted")}
                    disabled={app.status === "accepted"}
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      app.status === "accepted"
                        ? "bg-green-800/40 text-green-600 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 text-black"
                    }`}
                  >
                    Accept
                  </button>

                  {/* REJECT */}
                  <button
                    onClick={() => updateStatus(app._id, "rejected")}
                    disabled={app.status === "rejected"}
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      app.status === "rejected"
                        ? "bg-red-800/40 text-red-600 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600 text-black"
                    }`}
                  >
                    Reject
                  </button>
                </div>

                {/* DATE */}
                <p className="text-gray-400 text-sm mt-3">
                  📅 Applied on:{" "}
                  {new Date(app.appliedAt).toLocaleDateString()}
                </p>

              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
