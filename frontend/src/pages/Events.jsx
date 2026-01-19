// frontend/src/pages/Events.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import EventCard from '../components/EventCard';

export default function Events({ user }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [busy, setBusy] = useState({}); // map id -> boolean for per-event actions
  const navigate = useNavigate();

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/events');
      setEvents(res.data || []);
    } catch (err) {
      console.error('Could not load events', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
    // listen for external changes (admin added/deleted/updated events)
    function onEventsUpdated() {
      loadEvents();
    }
    window.addEventListener('events:updated', onEventsUpdated);

    function onRegistered(e) {
      if (!e?.detail?.id) return;
      setRegisteredIds(prev => new Set(prev).add(e.detail.id.toString()));
    }
    window.addEventListener('registered:event', onRegistered);

    return () => {
      window.removeEventListener('events:updated', onEventsUpdated);
      window.removeEventListener('registered:event', onRegistered);
    };
  }, [loadEvents]);

  // Admin: delete event
  async function handleDelete(id) {
    if (!window.confirm('Delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents(prev => prev.filter(e => (e._id || e.id) !== id));
      // broadcast so other open clients (students) reload
      window.dispatchEvent(new Event('events:updated'));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Could not delete event. Check console.');
    }
  }

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {events.map(ev => {
        const id = ev._id || ev.id;
        return (
          <div key={id} className="">
            <EventCard event={ev} isRegistered={registeredIds.has(id.toString())} />
            <div className="mt-2 flex gap-2 items-center">
              <Link to={`/events/${id}`} className="px-3 py-1 border rounded">View</Link>
              {/* show admin controls if user is admin */}
              {user?.isAdmin && (
                <>
                  <button onClick={() => navigate(`/admin/edit/${id}`)} className="px-3 py-1 border rounded">Edit</button>
                  <button onClick={() => handleDelete(id)} className="px-3 py-1 bg-red-100 text-red-700 rounded">Delete</button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
