import { useState } from "react";
import API from "../lib/axiosInstance";
import { Button } from "@/components/ui/button";

export default function ApplyResumeModal({ open, onClose, jobId }) {
  const [useExisting, setUseExisting] = useState(true);
  const [newResume, setNewResume] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submitApplication = async () => {
    try {
      setLoading(true);

      let res;

      if (useExisting) {
        // APPLY USING EXISTING RESUME
        res = await API.post(`/applications/apply/${jobId}`);
      } else {
        // APPLY WITH NEW UPLOADED RESUME
        const fd = new FormData();
        fd.append("resume", newResume);

        res = await API.post(`/applications/apply/${jobId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      alert("Applied Successfully!");
      onClose(true);
    } catch (error) {
      alert(error.response?.data?.message || "Error applying");
      onClose(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-[#0d1522] border border-white/10 p-6 rounded-xl w-96 shadow-xl text-white">
        <h2 className="text-xl font-semibold mb-4">Apply for Job</h2>

        {/* SELECT OPTION */}
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={useExisting}
              onChange={() => setUseExisting(true)}
            />
            <span>Use existing resume</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={!useExisting}
              onChange={() => setUseExisting(false)}
            />
            <span>Upload new resume</span>
          </label>

          {!useExisting && (
            <input
              type="file"
              className="mt-2 text-white"
              accept="application/pdf"
              onChange={(e) => setNewResume(e.target.files[0])}
            />
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex justify-between mt-6">
          <Button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            Cancel
          </Button>

          <Button
            onClick={submitApplication}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-black font-semibold"
          >
            {loading ? "Applying..." : "Apply"}
          </Button>
        </div>
      </div>
    </div>
  );
}
