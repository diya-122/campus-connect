import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get('/auth/profile')
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  if (!user)
    return <p className="text-center text-gray-600 mt-8">Please log in to view your profile.</p>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 mt-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">My Profile</h2>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500">SRN</p>
          <p className="font-semibold">{user.srn}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="font-semibold">{user.name || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">College</p>
          <p className="font-semibold">{user.college || 'PES University'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-semibold">{user.email || 'example@college.edu'}</p>
        </div>
      </div>
    </div>
  );
}
