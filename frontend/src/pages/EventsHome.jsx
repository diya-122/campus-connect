// frontend/src/pages/EventsHome.jsx
import React, { useEffect, useState } from "react";
import api from '../api';
import EventCard from '../components/EventCard';

export default function EventsHome() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await api.get('/events');
        if (!mounted) return;
        setEvents(res.data || []);
      } catch (e) {
        console.warn('Could not load events', e);
        setEvents([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  // group by category
  const grouped = events.reduce((acc, ev) => {
    const cat = ev.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(ev);
    return acc;
  }, {});

  const order = ['Hackathon', 'Workshop', 'Other'];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-4xl font-bold text-left mb-6 text-blue-800">Upcoming</h1>

      {order.map(cat => (
        grouped[cat] && grouped[cat].length > 0 ? (
          <section key={cat} className="mb-8">
            <h2 className="text-sm font-semibold uppercase text-slate-700 mb-3">{cat}s</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {grouped[cat].map(ev => <EventCard key={ev._id || ev.id} event={ev} />)}
            </div>
          </section>
        ) : null
      ))}

      {/* Other category */}
      {grouped['Other'] && grouped['Other'].length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase text-slate-700 mb-3">Other Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {grouped['Other'].map(ev => <EventCard key={ev._id || ev.id} event={ev} />)}
          </div>
        </section>
      )}

      {/* If no events */}
      {!events.length && !loading && (
        <p className="text-slate-500">No upcoming events yet.</p>
      )}
    </div>
  );
}
