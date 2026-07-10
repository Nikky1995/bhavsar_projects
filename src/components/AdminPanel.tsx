"use client";

import { FormEvent, useEffect, useState } from "react";
import type { Event, EventImage } from "@/lib/types";
import { STATE_NAMES } from "@/lib/states";

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    stateCode: "MH",
    location: "",
    date: "",
    endDate: "",
    type: "upcoming_event" as Event["type"],
  });
  const [selectedEventId, setSelectedEventId] = useState("");
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
  const [uploadCaption, setUploadCaption] = useState("");
  const [createFiles, setCreateFiles] = useState<FileList | null>(null);
  const [createCaption, setCreateCaption] = useState("");
  const [inlineUploadEventId, setInlineUploadEventId] = useState<string | null>(null);
  const [inlineFiles, setInlineFiles] = useState<FileList | null>(null);
  const [inlineCaption, setInlineCaption] = useState("");

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/auth");
        const data = await res.json();
        setAuthenticated(data.authenticated);
        if (data.authenticated) {
          const eventsRes = await fetch("/api/events");
          const eventsData = await eventsRes.json();
          setEvents(eventsData.events ?? []);
        }
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  async function loadEvents() {
    const res = await fetch("/api/events");
    const data = await res.json();
    setEvents(data.events ?? []);
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setAuthError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthenticated(true);
      await loadEvents();
    } else {
      setAuthError("Invalid password");
    }
  }

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    setAuthenticated(false);
    setEvents([]);
  }

  async function uploadImagesToEvent(
    eventId: string,
    files: FileList,
    caption?: string,
  ): Promise<boolean> {
    const formData = new FormData();
    formData.append("eventId", eventId);
    if (caption) formData.append("caption", caption);
    Array.from(files).forEach((file) => formData.append("images", file));

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    return res.ok;
  }

  async function handleCreateEvent(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      const newEventId = data.event?.id as string | undefined;

      if (newEventId && createFiles?.length) {
        const uploaded = await uploadImagesToEvent(newEventId, createFiles, createCaption);
        if (!uploaded) {
          setMessage("Event created, but photo upload failed. Try uploading from the gallery section.");
          setCreateFiles(null);
          setCreateCaption("");
          await loadEvents();
          return;
        }
      }

      setMessage(
        createFiles?.length
          ? "Event created with photos!"
          : "Event created successfully!",
      );
      setForm({
        title: "",
        description: "",
        stateCode: "MH",
        location: "",
        date: "",
        endDate: "",
        type: "upcoming_event",
      });
      setCreateFiles(null);
      setCreateCaption("");
      await loadEvents();
    } else {
      setMessage("Failed to create event");
    }
  }

  async function handleDeleteEvent(id: string) {
    if (!confirm("Delete this event and all its images?")) return;
    const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMessage("Event deleted");
      await loadEvents();
    }
  }

  async function handleUploadImages(e: FormEvent) {
    e.preventDefault();
    if (!selectedEventId || !uploadFiles?.length) return;
    setMessage("");

    const ok = await uploadImagesToEvent(selectedEventId, uploadFiles, uploadCaption);
    if (ok) {
      setMessage("Images uploaded successfully!");
      setUploadFiles(null);
      setUploadCaption("");
      await loadEvents();
    } else {
      setMessage("Failed to upload images");
    }
  }

  async function handleInlineUpload(e: FormEvent, eventId: string) {
    e.preventDefault();
    if (!inlineFiles?.length) return;
    setMessage("");

    const ok = await uploadImagesToEvent(eventId, inlineFiles, inlineCaption);
    if (ok) {
      setMessage("Photos added to event!");
      setInlineUploadEventId(null);
      setInlineFiles(null);
      setInlineCaption("");
      await loadEvents();
    } else {
      setMessage("Failed to upload photos");
    }
  }

  async function handleDeleteImage(eventId: string, imageId: string) {
    if (!confirm("Delete this image?")) return;
    const res = await fetch(`/api/images/${imageId}?eventId=${eventId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setMessage("Image deleted");
      await loadEvents();
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-orange-700">Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold text-orange-950">Admin Login</h1>
        <p className="mt-2 text-gray-600">Manage events and gallery images</p>
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-orange-200 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              required
            />
          </div>
          {authError && <p className="text-sm text-red-600">{authError}</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-orange-600 px-4 py-2.5 font-medium text-white hover:bg-orange-700"
          >
            Sign In
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-orange-950">Admin Dashboard</h1>
          <p className="text-gray-600">Add events, upload photos, and manage content</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-orange-200 px-4 py-2 text-sm text-orange-800 hover:bg-orange-50"
        >
          Logout
        </button>
      </div>

      {message && (
        <div className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
          {message}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-orange-950">Add New Event</h2>
          <form onSubmit={handleCreateEvent} className="mt-4 space-y-4">
            <input
              type="text"
              placeholder="Event title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-orange-200 px-3 py-2 text-sm"
              required
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-orange-200 px-3 py-2 text-sm"
              rows={3}
              required
            />
            <select
              value={form.stateCode}
              onChange={(e) => setForm({ ...form, stateCode: e.target.value })}
              className="w-full rounded-lg border border-orange-200 px-3 py-2 text-sm"
            >
              {Object.entries(STATE_NAMES).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Location (city, state)"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full rounded-lg border border-orange-200 px-3 py-2 text-sm"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="rounded-lg border border-orange-200 px-3 py-2 text-sm"
                required
              />
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value as Event["type"] })
                }
                className="rounded-lg border border-orange-200 px-3 py-2 text-sm"
              >
                <option value="upcoming_event">Upcoming Event</option>
                <option value="social_activity">Social Activity</option>
                <option value="past_event">Past Event</option>
              </select>
            </div>
            <div className="rounded-lg border border-dashed border-orange-200 bg-orange-50/50 p-3">
              <p className="text-sm font-medium text-orange-900">Event Photos (optional)</p>
              <p className="mt-1 text-xs text-gray-500">
                Add photos now or upload them later from the gallery section below.
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setCreateFiles(e.target.files)}
                className="mt-3 w-full text-sm"
              />
              <input
                type="text"
                placeholder="Photo caption (optional)"
                value={createCaption}
                onChange={(e) => setCreateCaption(e.target.value)}
                className="mt-2 w-full rounded-lg border border-orange-200 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-700"
            >
              Create Event
            </button>
          </form>
        </section>

        <section className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-orange-950">Upload Event Photos</h2>
          <p className="mt-1 text-sm text-gray-500">
            Add photos to an existing event. You can also attach photos when creating a new event.
          </p>
          <form onSubmit={handleUploadImages} className="mt-4 space-y-4">
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full rounded-lg border border-orange-200 px-3 py-2 text-sm"
              required
            >
              <option value="">Select an event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title} ({event.state})
                </option>
              ))}
            </select>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setUploadFiles(e.target.files)}
              className="w-full text-sm"
              required
            />
            <input
              type="text"
              placeholder="Caption (optional)"
              value={uploadCaption}
              onChange={(e) => setUploadCaption(e.target.value)}
              className="w-full rounded-lg border border-orange-200 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-700"
            >
              Upload Images
            </button>
          </form>
        </section>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-orange-950">All Events ({events.length})</h2>
        <div className="mt-4 space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-xl border border-orange-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-orange-950">{event.title}</h3>
                  <p className="text-sm text-gray-600">
                    {event.state} · {event.location} · {event.date}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{event.description}</p>
                  <p className="mt-2 text-xs text-orange-600">
                    {event.images.length} photo{event.images.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setInlineUploadEventId(
                        inlineUploadEventId === event.id ? null : event.id,
                      );
                      setInlineFiles(null);
                      setInlineCaption("");
                    }}
                    className="rounded-lg bg-orange-100 px-3 py-1.5 text-xs text-orange-800 hover:bg-orange-200"
                  >
                    {inlineUploadEventId === event.id ? "Cancel" : "Add Photos"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(event.id)}
                    className="rounded-lg bg-red-50 px-3 py-1.5 text-xs text-red-700 hover:bg-red-100"
                  >
                    Delete Event
                  </button>
                </div>
              </div>

              {inlineUploadEventId === event.id && (
                <form
                  onSubmit={(e) => handleInlineUpload(e, event.id)}
                  className="mt-4 rounded-lg border border-orange-100 bg-orange-50/50 p-4"
                >
                  <p className="text-sm font-medium text-orange-900">Add photos to this event</p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setInlineFiles(e.target.files)}
                    className="mt-3 w-full text-sm"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Caption (optional)"
                    value={inlineCaption}
                    onChange={(e) => setInlineCaption(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-orange-200 px-3 py-2 text-sm"
                  />
                  <button
                    type="submit"
                    className="mt-3 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                  >
                    Upload Photos
                  </button>
                </form>
              )}

              {event.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {event.images.map((image: EventImage) => (
                    <div key={image.id} className="group relative overflow-hidden rounded-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.url}
                        alt={image.caption ?? event.title}
                        className="h-24 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(event.id, image.id)}
                        className="absolute right-1 top-1 rounded bg-red-600 px-2 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
