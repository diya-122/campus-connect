// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Assuming your API client is set up

export default function Login({ onLogin }) {
  const [srn, setSrn] = useState('');
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); // Clear previous errors
    try {
      const res = await api.post('/auth/login', { srn, password: pwd });
      const user = res.data?.user;

      if (!user) {
        setErr(res.data?.message || 'Login failed: No user data received.');
        return;
      }
      
      // Call onLogin prop if provided
      if (onLogin) onLogin(user); 
      
      // Redirect to events page on successful login
      navigate('/events');

    } catch (error) {
      console.error('Login error:', error);
      // Display specific error message from the backend or a generic one
      setErr(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    // Outer container for centering and background. This assumes a full page layout.
    // If this component is nested, you might remove the min-h-screen and bg-gray-50 parts.
    <div className="min-h-screen flex items-center justify-center  bg-[url('/images/bg.jpg')] bg-cover bg-center px-4">
      <div className="z-5 w-full max-w-md bg-white dark:bg-gray-800 p-8 md:p-10 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-8">
          Student Login
        </h2>

        <form onSubmit={submit} className="space-y-6">
          {/* SRN Input Field */}
          <div>
            <label htmlFor="srn" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Student Registration Number (SRN)
            </label>
            <input
              type="text"
              id="srn"
              value={srn}
              onChange={(e) => setSrn(e.target.value)}
              placeholder="e.g., PES1UG*******"
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
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                         transition duration-200 ease-in-out placeholder-gray-400 dark:placeholder-gray-500"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm
                       text-lg font-semibold text-white bg-cyan-500
                       hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                       dark:bg-cyan-700 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-800
                       transition duration-200 ease-in-out"
          >
            Log In
          </button>

          {/* Error Message */}
          {err && (
            <p className="mt-4 text-center text-red-600 dark:text-red-400 text-sm font-medium">
              {err}
            </p>
          )}

          {/* Forgot Password Link (Optional but good for UX) */}
          <div className="text-center text-sm">
            <a 
              href="/forgot-password" 
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Forgot your password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}