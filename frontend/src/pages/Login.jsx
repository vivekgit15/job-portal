import { useEffect, useState } from "react";
import API from "../lib/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErr = {};

    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErr.email = "Invalid email";
    }

    if (form.password.length < 6) {
      newErr.password = "Password must be 6 characters long";
    }

    setErr(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await API.post("/auth/login", form);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    navigate("/dashboard");
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center text-white overflow-hidden">

      {/* DARK BACKGROUND + GRID + GLOWS */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1120] to-[#05080f]" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.04]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,255,120,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_70%)]" />

      {/* GLASS CARD */}
      <Card className="relative z-10 w-[380px] bg-[#0d1522]/70 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,255,120,0.06)] rounded-2xl">

        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-white">
            Welcome Back
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div>
              <Label className="text-gray-200 pb-2">Email</Label>
              <Input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="bg-white/10 text-white border border-white/20 placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                required
              />
              {err.email && (
                <p className="text-red-400 text-sm mt-1">{err.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <Label className="text-gray-200 pb-2">Password</Label>
              <Input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="bg-white/10 text-white border border-white/20 placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                required
              />
              {err.password && (
                <p className="text-red-400 text-sm mt-1">{err.password}</p>
              )}
            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold text-lg py-2 rounded-md shadow-lg transition"
            >
              Login
            </Button>
            <div className="flex justify-end">
              <Link 
                to="/forgot-password"
                className="text-sm text-blue-100 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
