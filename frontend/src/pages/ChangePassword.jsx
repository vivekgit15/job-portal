import { useState } from "react";
import API from "../lib/axiosInstance";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/auth/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Password updated! Redirecting...");
      setTimeout(() => navigate("/profile"), 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-xl rounded-xl">
      <h2 className="text-2xl font-bold text-center mb-6">Change Password</h2>

      <form onSubmit={handleChangePassword}>
        {/* Current Password */}
        <label className="font-medium">Current Password</label>
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            className="w-full p-3 rounded-lg border border-gray-300 mt-1 focus:outline-none focus:border-blue-500"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-4 text-sm text-gray-500 cursor-pointer"
            onClick={() => setShowCurrent(!showCurrent)}
          >
            {showCurrent ? "Hide" : "Show"}
          </span>
        </div>

        {/* New Password */}
        <label className="font-medium mt-4 block">New Password</label>
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            className="w-full p-3 rounded-lg border border-gray-300 mt-1 focus:outline-none focus:border-blue-500"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-4 text-sm text-gray-500 cursor-pointer"
            onClick={() => setShowNew(!showNew)}
          >
            {showNew ? "Hide" : "Show"}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>

      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}

export default ChangePassword;
