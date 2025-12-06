import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../lib/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ApplyResumeModal from "../components/ApplyResumeModal";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applied, setApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await API.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchJob();
  }, [id]);

  if (!job)
    return (
      <div className="text-center text-white pt-40 text-lg">Loading...</div>
    );

  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1120] to-[#05080f]" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.04]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,255,120,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_70%)]" />

      {/* CONTENT */}
      <div className="relative z-10 px-6 pt-32 pb-20 max-w-3xl mx-auto">

        <Card className="bg-[#0d1522]/80 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,255,120,0.06)] rounded-xl">
          
          <CardHeader>
            <CardTitle className="text-3xl text-white font-bold flex items-center gap-3">
              {job.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="text-gray-300 space-y-4">

            <p>
              <strong className="text-white">Company:</strong> {job.postedBy?.name}
            </p>

            <p>
              <strong className="text-white">Location:</strong> {job.location}
            </p>

            <p>
              <strong className="text-white">Salary:</strong> {job.salary}
            </p>

            <div>
              <strong className="text-white block mb-1">Description:</strong>
              <p className="text-gray-300">{job.description}</p>
            </div>

            <div>
              <strong className="text-white block mb-1">Requirements:</strong>
              <p className="whitespace-pre-wrap text-gray-300">
                {job.requirements}
              </p>
            </div>

            {/* APPLY BUTTON (JOBSEEKERS ONLY) */}
            {user?.role === "jobseeker" && (
              <div className="flex justify-center pt-4">
                <Button
                  className="w-56 bg-green-500 hover:bg-green-600 text-black font-semibold shadow-lg"
                  onClick={() => setShowApplyModal(true)}
                  disabled={applied}
                >
                  {applied ? "Already Applied" : "Apply Now"}
                </Button>
              </div>
            )}

          </CardContent>
        </Card>
      </div>

      {/* APPLY RESUME MODAL */}
      <ApplyResumeModal
        open={showApplyModal}
        jobId={id}
        onClose={(success) => {
          setShowApplyModal(false);
          if (success) setApplied(true);
        }}
      />

    </div>
  );
}
