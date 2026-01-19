// frontend/src/pages/KodikonDetail.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api';

export default function KodikonDetail() {
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState(null);
  const LOCAL_PREFIX = 'localRegisteredEvents';

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await api.get('/events');
        if (!mounted) return;
        const list = res.data || [];
        const found = list.find(e => (e.title||'').toLowerCase().includes('kodikon'));
        if (found) setEvent(found);
      } catch (e) {
        console.warn('Could not fetch events', e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => mounted = false;
  }, []);

  useEffect(() => {
    let mounted = true;
    async function check() {
      if (!mounted) return;
      if (!event) { setIsRegistered(false); return; }
      try {
        const mine = await api.get('/events/mine').catch(()=>null);
        const serverIds = (mine && mine.data && mine.data.registeredEvents) ? mine.data.registeredEvents.map(e => e._id || e.id) : [];
        if (serverIds.includes(event._id || event.id)) { setIsRegistered(true); return; }
      } catch {}
      try {
        const me = await api.get('/auth/me').catch(()=>null);
        const uid = me && me.data && me.data.user && me.data.user.id;
        const key = uid ? `${LOCAL_PREFIX}:${uid}` : `${LOCAL_PREFIX}:anon`;
        const raw = localStorage.getItem(key);
        if (raw) {
          const list = JSON.parse(raw);
          const found = list.some(l => (l._id && (l._id === (event._id || event.id))) || (l.title && l.title === event.title));
          setIsRegistered(Boolean(found)); return;
        }
      } catch(e){}
      setIsRegistered(false);
    }
    check();
    return () => mounted = false;
  }, [event]);

  async function confirmRegistered() {
    const evObj = event || {
      _id: `local-kodikon-${Date.now()}`,
      title: 'KODIKON 5.0 — 24 Hour National Hackathon',
      date: '2025-11-15',
      club: 'Embryone',
      description: 'KODIKON 5.0 — national-level hackathon powered by Pixcellence.',
      image: '/images/kodikon.jpeg',
      registrationLink: 'https://hack2skill.com/hack/kodikon5.0'
    };

    const realId = evObj._id || `local-${Date.now()}`;
    if (isRegistered) return;

    setIsRegistered(true);
    setRegistering(true);
    setError(null);
    window.dispatchEvent(new CustomEvent('registered:event', { detail: { id: realId } }));

    try {
      if (event && (event._id || event.id)) {
        const res = await api.post(`/events/${event._id || event.id}/register`);
        if (res.data && (res.data.message === 'registered' || res.data.message === 'already registered')) {
          setRegistering(false);
          navigate('/my-events');
          return;
        }
      }
    } catch (e) { console.warn('backend failed', e); }

    try {
      const me = await api.get('/auth/me').catch(()=>null);
      const uid = me && me.data && me.data.user && me.data.user.id;
      const key = uid ? `${LOCAL_PREFIX}:${uid}` : `${LOCAL_PREFIX}:anon`;
      const raw = localStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : [];
      const toStore = {
        _id: realId,
        title: evObj.title,
        date: evObj.date,
        club: evObj.club,
        description: evObj.description,
        image: evObj.image,
        registrationLink: evObj.registrationLink
      };
      const exists = list.some(e => (e._id && e._id === toStore._id) || (e.title && e.title === toStore.title));
      if (!exists) { list.push(toStore); localStorage.setItem(key, JSON.stringify(list)); window.dispatchEvent(new CustomEvent('registered:event', { detail: { id: toStore._id } })); }
    } catch (e) { console.error('Kodikon local save failed', e); setError('Could not save Kodikon locally.'); }
    finally { setRegistering(false); navigate('/my-events'); }
  }

  if (loading) return <div className="p-8 max-w-3xl mx-auto">Loading…</div>;
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-6">
      <img src="/images/kodikon.jpeg" alt="Kodikon" className="rounded-xl mb-6 w-full object-cover" />
      <h1 className="text-3xl font-bold mb-4">KODIKON 5.0 — 24 Hour National Hackathon</h1>
      <p className="text-gray-700 mb-6">{event ? (event.description || '') : '24-hour national-level hackathon powered by Pixcellence.'}</p>

      <div className="text-center">
        <a
          href={event ? (event.googleForm || event.registrationLink || '#') : 'https://hack2skill.com/hack/kodikon5.0'}
          target="_blank"
          rel="noreferrer"
          className={`inline-block px-6 py-2 rounded-full font-semibold ${isRegistered ? 'bg-slate-200 text-slate-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          onClick={(e)=>{ if (isRegistered) e.preventDefault(); }}
        >
          {isRegistered ? 'Already registered' : 'Register Now'}
        </a>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={confirmRegistered}
          disabled={isRegistered || registering}
          className={`inline-block mt-3 px-6 py-2 rounded-full font-semibold ${isRegistered ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
        >
          {registering ? 'Confirming…' : (isRegistered ? '✓ Registered — Added to My Events' : 'Have you registered for the event? — Yes')}
        </button>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      <div className="text-center mt-6">
        <button onClick={() => window.history.back()} className="text-sm text-gray-500 hover:underline">← Back to Events</button>
      </div>
    </div>
  );
}
