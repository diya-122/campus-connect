import React, { useEffect, useState } from 'react';
import api from '../api';
import EventCard from '../components/EventCard';

export default function Dashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get('/events').then(r => setEvents(r.data)).catch(()=>{});
  }, []);

  // group by category
  const grouped = events.reduce((acc, ev) => {
    const cat = ev.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(ev);
    return acc;
  }, {});

  // maintain order
  const order = ['Hackathon', 'Workshop', 'Other'];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">UPCOMING</h1>

      {order.map(cat => (
        grouped[cat] && grouped[cat].length > 0 ? (
          <section key={cat} className="mb-8">
            <h2 className="text-sm font-semibold uppercase text-slate-700 mb-3">{cat}s</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {grouped[cat].map(ev => <EventCard key={ev._id} event={ev} />)}
            </div>
          </section>
        ) : null
      ))}

      {/* Other category (any leftover categories) */}
      {grouped['Other'] && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase text-slate-700 mb-3">Other Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {grouped['Other'].map(ev => <EventCard key={ev._id} event={ev} />)}
          </div>
        </section>
      )}
    </div>
  );
}
