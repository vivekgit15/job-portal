import { useState } from "react";
import API from "@/lib/axiosInstance";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await API.post(
        "/auth/forgot-password",
        { email }
      );

      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-xl rounded-xl">
      <h2 className="text-2xl font-bold text-center mb-2">Forgot Password</h2>
      <p className="text-center text-gray-600 mb-6">
        Enter your registered email to receive a reset link.
      </p>

      <form onSubmit={handleSubmit}>
        <label className="font-medium">Email Address</label>
        <input
          type="email"
          className="w-full p-3 rounded-lg border border-gray-300 mt-1 focus:outline-none focus:border-blue-500"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-5 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}

export default ForgotPassword;
