// frontend/src/pages/LoginSelector.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginSelector() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-grey-800 bg-[url('/images/welcome2.jpeg')] bg-cover bg-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Campus Connect</h1>
        <p className="text-sm text-slate-600 mb-6">Choose how you want to sign in</p>

        <div className="space-y-3">
          <button
            onClick={() => nav('/login')}
            className="w-full px-4 py-3 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700"
          >
            Login as Student
          </button>

          <button
            onClick={() => nav('/admin/login')}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg font-semibold hover:bg-slate-50"
          >
            Login as Admin
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-6">If you already have a session you will be redirected automatically after login.</p>
      </div>
    </div>
  );
}