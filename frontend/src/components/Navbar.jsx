import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav
      className="flex justify-between items-center 
      px-10 py-4 fixed top-0 left-0 w-full z-50
      bg-[#0b1120]/80 backdrop-blur-xl 
      border-b border-white/10
      text-white shadow-md"
    >

      {/* LOGO */}
      <Link
        to="/"
        className="font-extrabold text-2xl tracking-wide hover:opacity-90 transition"
      >
        JobPortal
      </Link>

      <div className="flex items-center gap-6 text-lg font-medium">

        {/* If NOT logged in */}
        {!token && (
          <>
            <Link className="hover:text-gray-300 transition" to="/login">
              Login
            </Link>
            <Link className="hover:text-gray-300 transition" to="/signup">
              Signup
            </Link>
          </>
        )}

        {/* If logged in */}
        {token && (
          <>
            {/* DASHBOARD */}
            <Link to="/dashboard" className="hover:text-gray-300 transition">
              Dashboard
            </Link>

            {/* JOBSEEKER ONLY */}
            {user?.role === "jobseeker" && (
              <Link
                to="/applications/my"
                className="hover:text-gray-300 transition"
              >
                My Applications
              </Link>
            )}

            {/* EMPLOYER ONLY */}
            {user?.role === "employer" && (
              <Link
                to="/post-job"
                className="px-4 py-2 rounded-md bg-white/20  
                hover:bg-white/30 backdrop-blur-sm border border-white/20 
                shadow transition-all"
              >
                + Post Job
              </Link>
            )}

            {/* PROFILE BUTTON */}
            <button
              onClick={() => navigate("/profile")}
              className="w-10 h-10 rounded-full overflow-hidden 
              border border-white/20 shadow hover:scale-105 transition"
            >
              <img
                src={
                  user?.profilePhoto ||
                  "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                }
                className="w-full h-full object-cover"
              />
            </button>

            {/* LOGOUT ICON */}
            {/* <button
              onClick={handleLogout}
              className="p-2 rounded-md bg-white text-blue-700 
              hover:bg-gray-100 shadow hover:shadow-lg transition"
            >
              <LogOut size={18} />
            </button> */}
          </>
        )}
      </div>
    </nav>
  );
}
