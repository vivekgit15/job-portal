import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, User, FileText, BriefcaseBusiness, Settings } from "lucide-react";

export default function ProfileSidebar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // helper to highlight active link
  const active = (path) =>
    location.pathname === path ? "bg-white/15" : "hover:bg-white/10";

  return (
    <aside className="
      bg-[#0d1522]/70 backdrop-blur-xl 
      border border-white/10 shadow-xl
      w-72 h-full rounded-xl p-6 text-white
      flex flex-col gap-6
    ">
      
      {/* PROFILE HEADER */}
      <div className="flex flex-col items-center text-center">
        <img
          src={
            user.profilePhoto ||
            "https://cdn-icons-png.flaticon.com/512/847/847969.png"
          }
          className="w-20 h-20 rounded-full border border-white/20 object-cover mb-3"
        />

        <h2 className="font-bold text-xl">{user.name}</h2>
        <p className="text-sm text-gray-400">{user.email}</p>

        <span className="
          mt-3 text-xs px-3 py-1 rounded-full 
          bg-green-500/20 text-green-400 border border-green-600/30
        ">
          {user.role.toUpperCase()}
        </span>
      </div>

      <div className="h-px bg-white/10"></div>

      {/* NAV LINKS */}
      <nav className="flex flex-col gap-3">

        {/* ONLY SHOW Profile link if NOT currently on profile */}
        {location.pathname !== "/profile" && (
          <Link
            to="/profile"
            className={`flex items-center gap-3 p-2 rounded-md transition ${active("/profile")}`}
          >
            <User size={18} /> Profile
          </Link>
        )}

        {user.role === "jobseeker" && (
          <Link
            to="/applications/my"
            className={`flex items-center gap-3 p-2 rounded-md transition ${active("/applications/my")}`}
          >
            <FileText size={18} /> My Applications
          </Link>
        )}

        {user.role === "employer" && (
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 p-2 rounded-md transition ${active("/dashboard")}`}
          >
            <BriefcaseBusiness size={18} /> Posted Jobs
          </Link>
        )}

        <Link
          to="/profile/change-password"
          className={`flex items-center gap-3 p-2 rounded-md transition ${active("/profile/change-password")}`}
        >
          <Settings size={18} /> Change Password
        </Link>
      </nav>

      {/* LOGOUT BUTTON */}
      <button
        onClick={logout}
        className="
          mt-auto flex items-center gap-2 justify-center 
          p-3 bg-red-500/20 text-red-300 
          hover:bg-red-500/30 border border-red-600/30 
          rounded-md transition
        "
      >
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}
