// frontend/src/components/EventCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function EventCard({ event, isRegistered = false }) {
  const poster = event?.image || "";
  const posterUrl =
    poster && (poster.startsWith("http://") || poster.startsWith("https://"))
      ? poster
      : poster
      ? `/images/${poster}`
      : null;

  return (
    <article className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col overflow-hidden relative border border-slate-100">
      {/* ✅ Registered Badge */}
      {isRegistered && (
        <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-medium px-2.5 py-1 rounded-full z-10 shadow-md animate-fadeIn">
          ✓ Registered
        </div>
      )}

      {/* ✅ Event Image */}
      {posterUrl ? (
        <div className="w-full h-60 md:h-72 overflow-hidden">
          <img
            src={posterUrl}
            alt={event.title || "Event poster"}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      ) : (
        <div className="w-full h-60 md:h-72 bg-slate-100 flex items-center justify-center text-slate-400 italic">
          No image available
        </div>
      )}

      {/* ✅ Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        {/* Title + Category */}
        <div className="flex items-start justify-between">
          <div className="max-w-[70%]">
            <h3 className="text-lg font-semibold text-gray-800 leading-tight">
              {event.title}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {event.club} ·{" "}
              {event.date ? new Date(event.date).toLocaleDateString() : ""}
            </p>
          </div>

          {event.category && (
            <div className="px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-700 text-xs font-medium whitespace-nowrap shadow-sm">
              {event.category}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="mt-3 text-sm text-gray-600 line-clamp-3">
          {event.description}
        </p>

        {/* Footer (Venue + Buttons) */}
        <div className="mt-5 flex items-center justify-between">
          <div className="text-sm text-gray-500 font-medium">
            {event.venue || ""}
          </div>

          <div className="flex items-center">
            <Link
              to={`/events/${event._id || event.id}`}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 underline underline-offset-2 transition-all"
            >
              Details
            </Link>

            {event.registrationLink && (
              <a
                href={event.registrationLink}
                target="_blank"
                rel="noreferrer"
                className="ml-4 text-sm px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md hover:shadow-lg transition-all"
              >
                Register
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
