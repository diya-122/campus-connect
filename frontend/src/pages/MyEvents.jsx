import React, { useEffect, useState, useCallback } from 'react';
import api from '../api';
import EventCard from '../components/EventCard';

export default function MyEvents() {
  const [mine, setMine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const LOCAL_PREFIX = 'localRegisteredEvents';

  const getCurrentUserId = async () => {
    try {
      const res = await api.get('/auth/me');
      return res?.data?.user?._id || res?.data?.user?.id || null;
    } catch {
      return null;
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const userId = await getCurrentUserId();
    const localKey = userId ? `${LOCAL_PREFIX}:${userId}` : `${LOCAL_PREFIX}:anon`;

    let local = [];
    try {
      const raw = localStorage.getItem(localKey);
      local = raw ? JSON.parse(raw) : [];
    } catch {
      local = [];
    }

    try {
      const res = await api.get('/events/mine');
      const serverEvents = res?.data?.registeredEvents || [];
      const byId = new Map();

      // Combine both sources (server + local) uniquely
      [...serverEvents, ...local].forEach(ev => {
        const id = ev._id || ev.id || ev.title;
        if (id) byId.set(id.toString(), ev);
      });

      setMine(Array.from(byId.values()));
    } catch (err) {
      console.warn('Could not fetch registered events; showing local only', err);
      setMine(local);
      setError('Could not fetch your events from the server. Showing locally saved ones.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const onRegistered = () => load();
    window.addEventListener('registered:event', onRegistered);
    return () => window.removeEventListener('registered:event', onRegistered);
  }, [load]);

  if (loading) return <div className="p-6 text-slate-700">Loading your events…</div>;
  if (error)
    return (
      <div className="p-6 text-red-600">
        {error} <button className="underline ml-2" onClick={load}>Retry</button>
      </div>
    );
  if (!mine || mine.length === 0)
    return <div className="p-6 text-slate-600">You haven’t registered for any events yet.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Registered Events</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mine.map((e) => (
          <EventCard key={e._id || e.id || e.title} event={e} isRegistered={true} />
        ))}
      </div>
    </div>
  );
}
