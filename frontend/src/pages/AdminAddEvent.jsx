import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

export default function AdminAddEvent() {
  const [title, setTitle] = useState("");
  const [club, setClub] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");
  const [category, setCategory] = useState("Other");
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  async function uploadImage() {
  // We’re not uploading to backend, just using static images in /public/images
  if (!imageFile) return "";
  return imageFile.name; // the file’s name (e.g., tinybrains.jpeg)
}

async function submit(e) {
  e.preventDefault();
  setSaving(true);
  try {
    const image = await uploadImage();
    const payload = {
      title,
      club,
      date,
      description,
      registrationLink,
      category,
      image,
    };
    const res = await api.post("/events", payload);
    toast.success("Event created successfully!");
    window.dispatchEvent(new Event("events:updated"));
    navigate("/admin/events");
  } catch (err) {
    console.error("Create failed:", err.response?.data || err.message);
    toast.error("Failed to create event");
  } finally {
    setSaving(false);
  }
}


  
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow mt-6">
      <h2 className="text-3xl font-semibold mb-6 border-b pb-2">
        Add New Event
      </h2>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-cyan-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Club / Organiser
            </label>
            <input
              value={club}
              onChange={(e) => setClub(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-cyan-600"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-cyan-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-cyan-600"
            >
              <option>Other</option>
              <option>Workshop</option>
              <option>Festival</option>
              <option>Seminar</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-cyan-600 h-32"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Poster image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            disabled={saving}
            className="px-5 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg"
          >
            {saving ? "Creating…" : "Create Event"}
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
