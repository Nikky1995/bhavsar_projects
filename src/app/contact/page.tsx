"use client";

import { FormEvent, useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-orange-950">Contact Us</h1>
      <p className="mt-2 text-gray-600">
        Reach out to the Bhavsar Kshatriya Samaj central committee or your local chapter.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-orange-900">General Inquiries</h2>
            <p className="mt-2 text-sm text-gray-600">
              Email:{" "}
              <a href="mailto:contact@bhavsarprojects.com" className="text-orange-600 hover:underline">
                contact@bhavsarprojects.com
              </a>
            </p>
            <p className="text-sm text-gray-600">Website: bhavsarprojects.com</p>
          </div>

          <div className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-orange-900">Register Your Chapter</h2>
            <p className="mt-2 text-sm text-gray-600">
              If your local Bhavsar Samaj chapter is not yet on our community map, use the
              form to share your details and we will add your events to the portal.
            </p>
          </div>

          <div className="rounded-xl border border-orange-100 bg-orange-50 p-6">
            <h2 className="font-semibold text-orange-900">Office Hours</h2>
            <p className="mt-2 text-sm text-gray-600">
              Monday – Saturday: 10:00 AM – 6:00 PM IST
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-green-200 bg-green-50 p-10 text-center">
            <div className="text-4xl">✓</div>
            <h2 className="mt-4 text-xl font-semibold text-green-800">Message Sent!</h2>
            <p className="mt-2 text-sm text-green-700">
              Thank you for reaching out. We will get back to you shortly.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm"
          >
            <h2 className="font-semibold text-orange-900">Send a Message</h2>
            <div className="mt-4 space-y-4">
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-orange-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
                required
              />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-orange-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
                required
              />
              <input
                type="tel"
                placeholder="Phone (optional)"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-lg border border-orange-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
              />
              <textarea
                placeholder="Your message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-lg border border-orange-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
                rows={5}
                required
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-orange-600 px-4 py-3 font-medium text-white hover:bg-orange-700"
              >
                Send Message
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
