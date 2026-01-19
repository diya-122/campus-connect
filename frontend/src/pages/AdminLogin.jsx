import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AdminLogin({ onAdminLogin }) {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await api.post('/auth/admin-login', { adminId, password });
      const user = res.data?.user;

      if (!user) {
        setErr(res.data?.message || 'Login failed: No admin data received.');
        setLoading(false);
        return;
      }
      
      if (onAdminLogin) onAdminLogin(user);
      navigate('/admin/events');

    } catch (error) {
      console.error('Admin login error', error);
      // Display specific error message from the backend or a generic one
      setErr(error?.response?.data?.message || 'Admin Login failed. Please check your credentials.');
    } finally { 
      setLoading(false); 
    }
  };

  return (
    // Outer container: centered on screen with background image
    // Using the admin-specific image path: './admin.jpg'
    <div className="min-h-screen flex items-center justify-center bg-[url('/images/adminbg.jpg')] bg-cover bg-center px-4">
      
      {/* Login Card: enhanced shadow, border, and background for a premium look */}
      <div className="z-5 w-full max-w-md bg-white dark:bg-gray-800 p-8 md:p-10 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700">
        
        {/* Heading: larger and bolder */}
        <h2 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-8">
          Admin Login
        </h2>

        <form onSubmit={submit} className="space-y-6">
          
          {/* Admin ID Input Field */}
          <div>
            <label htmlFor="adminId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Administrator ID
            </label>
            <input
              type="text"
              id="adminId"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="e.g., ADMIN-001"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                         transition duration-200 ease-in-out placeholder-gray-400 dark:placeholder-gray-500"
              required
            />
          </div>

          {/* Password Input Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                         transition duration-200 ease-in-out placeholder-gray-400 dark:placeholder-gray-500"
              required
            />
          </div>

          {/* Login Button: maintained cyan color with enhanced hover/focus/loading states */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm
                       text-xl font-semibold text-white bg-cyan-600 
                       hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition duration-200 ease-in-out"
          >
            {loading ? 'Authenticating…' : 'Log In'}
          </button>

          {/* Error Message */}
          {err && (
            <p className="mt-4 text-center text-red-600 dark:text-red-400 text-sm font-medium">
              {err}
            </p>
          )}

          {/* Forgot Password Link (for completeness) */}
          <div className="text-center text-sm pt-2">
            <a 
              href="/admin/forgot-credentials" 
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Forgot ID or Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}