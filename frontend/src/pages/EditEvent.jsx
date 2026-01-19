import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    club: "",
    date: "",
    description: "",
    registrationLink: "",
    category: "Other",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);

  // ✅ Load existing event details
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setForm({
          title: res.data.title || "",
          club: res.data.club || "",
          date: res.data.date
            ? new Date(res.data.date).toISOString().slice(0, 10)
            : "",
          description: res.data.description || "",
          registrationLink: res.data.registrationLink || "",
          category: res.data.category || "Other",
          image: res.data.image || "",
        });
      } catch (err) {
        console.error("Failed to load event:", err);
        toast.error("Could not load event details");
        navigate("/admin/events");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  // ✅ Simplified static image handling (no upload endpoint)
  async function uploadImage() {
    if (!imageFile) return form.image || "";
    return imageFile.name; // Just use the file name for static serving
  }

  // ✅ Handle update
  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const imageUrl = await uploadImage();

      const payload = {
        title: form.title,
        club: form.club,
        date: form.date,
        description: form.description,
        registrationLink: form.registrationLink,
        category: form.category,
        image: imageUrl, // backend expects this key
      };

      await api.put(`/events/${id}`, payload);
      toast.success("Event updated successfully!");
      window.dispatchEvent(new Event("events:updated"));
      navigate("/admin/events");
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow mt-6">
      <h2 className="text-3xl font-semibold mb-6 border-b pb-2 text-primary flex items-center gap-2">
        ✏️ Edit Event
      </h2>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Event Title"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-cyan-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Club / Organizer
          </label>
          <input
            value={form.club}
            onChange={(e) => setForm({ ...form, club: e.target.value })}
            placeholder="Club / Organizer"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-cyan-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-cyan-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Registration Link
          </label>
          <input
            value={form.registrationLink}
            onChange={(e) =>
              setForm({ ...form, registrationLink: e.target.value })
            }
            placeholder="Registration Link"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-cyan-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-cyan-600"
          >
            <option>Hackathon</option>
            <option>Workshop</option>
            <option>Festival</option>
            <option>Seminar</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-cyan-600 h-32"
            placeholder="Description"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Poster image (leave blank to keep existing)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          {form.image && (
            <p className="text-sm text-gray-500 mt-1">
              Current image: <span className="font-medium">{form.image}</span>
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            disabled={saving}
            className={`px-5 py-2 rounded-lg text-white transition-all ${
              saving
                ? "bg-cyan-400 cursor-not-allowed"
                : "bg-cyan-700 hover:bg-cyan-800"
            }`}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/events")}
            className="px-5 py-2 border rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
