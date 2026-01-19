// frontend/src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import MyEvents from "./pages/MyEvents";
import Profile from "./pages/Profile";
import api from "./api";
import KodikonDetail from "./pages/KodikonDetail";
import EventsHome from "./pages/EventsHome";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import AdminEvents from "./pages/AdminEvents";
import AdminAddEvent from "./pages/AdminAddEvent";
import EditEvent from "./pages/EditEvent";
import LoginSelector from "./pages/LoginSelector";
import { Toaster } from "react-hot-toast";


export default function App() {
  // undefined = checking, null = not logged in, object = logged in
  const [user, setUser] = useState(undefined);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get("/auth/me");
        if(r.data?.user) setUser(r.data.user);
      } catch (e) {
        setUser(null);
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  const handleLogin = (userObj) => {
    setUser(userObj || null);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <img
            src="/images/logo.jpeg"
            alt="Loading"
            className="h-16 w-16 rounded-full shadow-md"
          />
          <p className="text-gray-600 font-medium">Checking session…</p>
        </div>
      </div>
    );
  }

  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-100 text-gray-900">
      
      {/* 🌟 Global Navbar */}
      <NavBar
        user={user}
        setUser={(u) => {
          if (!u) setUser(null);
          else setUser(u);
        }}
      />

      {/* 🌟 Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginSelector />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/admin/login"
            element={<AdminLogin onAdminLogin={handleLogin} />}
          />
          <Route path="/kodikon" element={<KodikonDetail />} />

          {/* Protected Student Routes */}
          <Route
            path="/events"
            element={
              isLoggedIn && user.role !== "admin" ? (
                <Events user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/events/:id"
            element={
              isLoggedIn && user.role !== "admin" ? (
                <EventDetail />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/events/:category/:id"
            element={
              isLoggedIn && user.role !== "admin" ? (
                <EventDetail />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/my-events"
            element={
              isLoggedIn && user.role !== "admin" ? (
                <MyEvents />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/profile"
            element={
              isLoggedIn ? <Profile /> : <Navigate to="/login" />
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/events"
            element={
              isLoggedIn && user.role === "admin" ? (
                <AdminEvents />
              ) : (
                <Navigate to="/admin/login" />
              )
            }
          />
          <Route
            path="/admin/add-event"
            element={
              isLoggedIn && user.role === "admin" ? (
                <AdminAddEvent />
              ) : (
                <Navigate to="/admin/login" />
              )
            }
          />
          <Route
            path="/admin/edit/:id"
            element={
              isLoggedIn && user.role === "admin" ? (
                <EditEvent />
              ) : (
                <Navigate to="/admin/login" />
              )
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* 🌟 Footer */}
      <footer className="bg-gray-900 text-gray-300 text-center py-4 mt-12 shadow-inner">
        <p className="text-sm">
          © {new Date().getFullYear()} Campus Connect. All rights reserved.
        </p>
      </footer>

      {/* ✅ Toast Notifications */}
      <Toaster position="top-right" />
    </div>
  );
}
