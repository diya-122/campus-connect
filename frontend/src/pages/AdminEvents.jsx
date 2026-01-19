import React, { useEffect, useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/events");
        setEvents(res.data || []);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load events");
      }
      setLoading(false);
    })();
  }, []);

  async function handleDelete(id) {
  if (!window.confirm("Are you sure you want to delete this event?")) return;

  try {
    await api.delete(`/events/${id}`); // ✅ Calls /api/events/:id
    setEvents(prev => prev.filter(e => (e._id || e.id) !== id));
    window.dispatchEvent(new Event("events:updated"));
    toast.success("Event deleted successfully!");
  } catch (err) {
    console.error("Delete failed:", err.response?.data || err.message);
    toast.error("Failed to delete event");
  }
}

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Admin — Events</h2>
        <button
          onClick={() => navigate("/admin/add-event")}
          className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg shadow-sm"
        >
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((ev) => {
          const id = ev._id || ev.id;
          return (
            <div
              key={id}
              className="p-5 bg-white rounded-lg shadow hover:shadow-md transition-all border flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-lg">{ev.title}</div>
                <p className="text-sm text-slate-500">
                  {ev.club} ·{" "}
                  {ev.date ? new Date(ev.date).toLocaleDateString() : ""}
                </p>
              </div>
              <div className="flex gap-2">
                
                <button
                  onClick={() => navigate(`/admin/edit/${id}`)}
                  className="px-3 py-1 border rounded hover:bg-slate-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(id)}
                  className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
