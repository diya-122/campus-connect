// frontend/src/components/NavBar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function NavBar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    navigate("/");
  };

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className="relative text-sm font-medium text-gray-800 hover:text-cyan-600 transition-all group"
    >
      {children}
      <span className="absolute left-0 -bottom-0.5 w-0 h-[2px] bg-cyan-500 group-hover:w-full transition-all duration-300"></span>
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* 🌟 Logo + Name */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/images/peslogo.jpeg"
            alt="Campus Connect Logo"
            className="h-10 w-10 rounded-full shadow-md hover:scale-105 transition-transform"
          />
          <span className="fmin-h-screen flex flex-col text-3xl items-center justify-center bg-white text-cyan-800 relative m">
            Campus Connect
          </span>
        </Link>

        {/* 🌟 Navigation Links */}
        <div className="flex items-center gap-5">
          <NavLink to="/events">Events</NavLink>
          <NavLink to="/my-events">My Events</NavLink>

          {user?.role === "admin" && <NavLink to="/admin/events">Admin</NavLink>}

          {/* 🌟 User Controls */}
          {user ? (
            <>
              <button
                onClick={() => navigate("/profile")}
                className="text-sm text-gray-700 font-medium hover:text-indigo-600 transition"
              >
                {user.name || user.srn || user.adminId}
              </button>
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1.5 rounded-lg border border-indigo-500 text-indigo-600 font-medium hover:bg-indigo-50 transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm px-6 py-2 rounded-lg bg-cyan-400 text-white font-medium hover:bg-cyan-600 shadow-md hover:shadow-lg transition-all duration-300"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}