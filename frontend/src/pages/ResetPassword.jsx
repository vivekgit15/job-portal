import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "@/lib/axiosInstance";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }

    try {
      await API.post("/auth/reset-password", {
        token,
        newPassword,
      });

      setMessage("Password reset successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-xl rounded-xl">
      <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>

      {!token ? (
        <p className="text-red-600 text-center">Invalid reset link</p>
      ) : (
        <form onSubmit={handleReset}>
          <label className="font-medium">New Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-3 rounded-lg border border-gray-300 mt-1 focus:outline-none focus:border-blue-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <span
              className="absolute right-3 top-4 text-sm text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button
            type="submit"
            className="w-full mt-5 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Reset Password
          </button>
        </form>
      )}

      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}

export default ResetPassword;
