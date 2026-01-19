import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState(null);

  const LOCAL_PREFIX = 'localRegisteredEvents';

  async function getCurrentUserId() {
    try {
      const me = await api.get('/auth/me');
      if (me.data && me.data.user && me.data.user.id) return me.data.user.id;
      return null;
    } catch (e) {
      return null;
    }
  }

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const evRes = await api.get(`/events/${id}`);
        if (!mounted) return;
        const evData = evRes.data;
        setEvent(evData);

        const userId = await getCurrentUserId();
        const localKey = userId ? `${LOCAL_PREFIX}:${userId}` : `${LOCAL_PREFIX}:anon`;

        const registeredSet = new Set();

        try {
          const mine = await api.get('/events/mine');
          const raw = mine.data?.registeredEvents || [];
          raw.forEach(e => {
            const i = e._id || e.id;
            if (i) registeredSet.add(i.toString());
          });
        } catch (e) {}

        try {
          const rawLocal = localStorage.getItem(localKey);
          if (rawLocal) {
            const localList = JSON.parse(rawLocal);
            (localList || []).forEach(le => {
              if (le._id) registeredSet.add(le._id.toString());
              else if (le.title && evData && evData.title && le.title === evData.title) {
                registeredSet.add(evData._id || `local-${le.title}`);
              }
            });
          }
        } catch (e) {}

        const eventId = evData._id || evData.id;
        if (mounted) setIsRegistered(registeredSet.has((eventId || '').toString()));
      } catch (err) {
        console.error('Failed to load event', err);
        if (mounted) setError('Failed to load event.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  async function confirmRegistered() {
    if (!event) {
      setError('Event not loaded yet. Try again.');
      return;
    }

    const realId = event._id || event.id || `local-${Date.now()}`;
    if (isRegistered) return;

    setIsRegistered(true);
    setRegistering(true);
    setError(null);
    window.dispatchEvent(new CustomEvent('registered:event', { detail: { id: realId } }));

    try {
      const res = await api.post(`/events/${realId}/register`);
      if (res.data && (res.data.message === 'registered' || res.data.message === 'already registered')) {
        setRegistering(false);
        navigate('/my-events');
        return;
      }
    } catch (err) {
      console.warn('backend register failed, falling back to local', err?.response?.status);
    }

    try {
      const userId = await getCurrentUserId();
      const key = userId ? `${LOCAL_PREFIX}:${userId}` : `${LOCAL_PREFIX}:anon`;
      const raw = localStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : [];

      const toStore = {
        _id: realId,
        title: event.title || 'Untitled Event',
        date: event.date || null,
        club: event.club || '',
        description: event.description || '',
        image: event.image || '',
        registrationLink: event.registrationLink || event.googleForm || '',
      };

      const exists = list.some(e => (e._id && e._id === toStore._id) || (e.title && e.title === toStore.title));
      if (!exists) {
        list.push(toStore);
        localStorage.setItem(key, JSON.stringify(list));
        window.dispatchEvent(new CustomEvent('registered:event', { detail: { id: toStore._id } }));
      }
    } catch (e) {
      console.error('local fallback save failed', e);
      setError('Could not save registration locally.');
    } finally {
      setRegistering(false);
      navigate('/my-events');
    }
  }

  if (loading) return <div className="p-8 max-w-3xl mx-auto">Loading event…</div>;
  if (!event) return <div className="p-8 max-w-3xl mx-auto">Event not found.</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Event Image */}
        {event.image ? (
  <img
    src={
      event.image.startsWith("http")
        ? event.image
        : `/images/${event.image}`
    }
    alt={event.title}
    className="w-full h-64 object-cover"
    onError={(e) => (e.target.style.display = "none")}
  />
) : (
  <div className="w-full h-64 bg-cyan-800" />
)}


        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">{event.title}</h1>
          <p className="text-sm text-slate-500 mb-4">
            {event.club} 
            {event.venue && <> · 📍 {event.venue}</>}
            {event.date && <> · 🕒 {new Date(event.date).toLocaleDateString()}</>}
            {event.endDate && <> – {new Date(event.endDate).toLocaleDateString()}</>}
          </p>

          {/* Optional Event Info */}
          {event.teamSize && (
            <p className="text-sm text-slate-600 mb-2">
              👥 Team Size: {event.teamSize}
            </p>
          )}

          <div className="prose max-w-none text-slate-700 mb-6 whitespace-pre-line">
            {event.description}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={isRegistered ? undefined : (event.registrationLink || event.googleForm || '#')}
              target={isRegistered ? undefined : '_blank'}
              rel="noreferrer"
              onClick={(e) => { if (isRegistered) e.preventDefault(); }}
              className={`inline-block text-center px-6 py-2 rounded-full font-semibold shadow ${
                isRegistered
                  ? 'bg-slate-200 text-slate-600 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isRegistered ? 'Already registered' : 'Register Now'}
            </a>

            <button
              onClick={confirmRegistered}
              disabled={isRegistered || registering}
              className={`inline-block px-6 py-2 rounded-full font-semibold transition ${
                isRegistered
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 cursor-default'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {registering
                ? 'Confirming…'
                : isRegistered
                ? '✓ Registered — Added to My Events'
                : 'Have you registered? — Yes'}
            </button>
          </div>

          {/* Instagram Link */}
          {event.instagram && (
            <div className="mt-5">
              <a
                href={event.instagram}
                target="_blank"
                rel="noreferrer"
                className="text-pink-600 hover:underline text-sm"
              >
                📸 Follow on Instagram
              </a>
            </div>
          )}

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <div className="mt-6 text-sm">
            <Link to="/events" className="text-blue-600 hover:underline">
              ← Back to Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
