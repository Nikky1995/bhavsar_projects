"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import type { Event } from "@/lib/types";
import { getStateName } from "@/lib/states";
import EventCard from "./EventCard";

const IndiaMap = dynamic(() => import("@aryanjsx/indiamap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] items-center justify-center rounded-xl bg-orange-50">
      <p className="text-orange-700">Loading map...</p>
    </div>
  ),
});

interface IndiaMapSectionProps {
  initialEvents?: Event[];
}

export default function IndiaMapSection({ initialEvents = [] }: IndiaMapSectionProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data.events ?? []))
      .catch(() => {});
  }, []);

  const stateName = selectedState ? getStateName(selectedState) : null;

  const stateEvents = selectedState
    ? events.filter((e) => e.stateCode === selectedState)
    : [];

  const socialActivities = stateEvents.filter((e) => e.type === "social_activity");
  const upcomingEvents = stateEvents.filter((e) => e.type === "upcoming_event");

  const handleClick = useCallback((stateCode: string) => {
    setSelectedState((prev) => (prev === stateCode ? null : stateCode));
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-orange-950">Community Map of India</h2>
        <p className="mt-2 text-gray-600">
          Hover over a state to highlight it, then click to explore Bhavsar Kshatriya Samaj
          activities and upcoming events in that region.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-4 shadow-inner">
          {stateName && (
            <div className="absolute left-4 top-4 z-10 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-semibold text-orange-900 shadow-sm backdrop-blur">
              {stateName}
            </div>
          )}
          <IndiaMap
            onClick={handleClick}
            size="100%"
            mapColor="#fef3c7"
            strokeColor="#c2410c"
            strokeWidth="0.8"
            hoverColor="#ea580c"
          />
        </div>

        <div className="flex flex-col">
          {!selectedState ? (
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/50 p-8 text-center">
              <div className="text-5xl">🗺️</div>
              <h3 className="mt-4 text-xl font-semibold text-orange-900">
                Select a State
              </h3>
              <p className="mt-2 max-w-sm text-gray-600">
                Click on any state on the map to view social activities and upcoming events
                organized by the Bhavsar Kshatriya Samaj in that region.
              </p>
            </div>
          ) : (
            <div className="space-y-6 overflow-y-auto rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-orange-950">{stateName}</h3>
                  <p className="text-sm text-gray-500">
                    {stateEvents.length} activit{stateEvents.length === 1 ? "y" : "ies"} found
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedState(null)}
                  className="rounded-lg bg-orange-100 px-3 py-1 text-sm text-orange-800 hover:bg-orange-200"
                >
                  Clear
                </button>
              </div>

              {stateEvents.length === 0 ? (
                <p className="text-gray-500">
                  No activities recorded yet for {stateName}. Check back soon or contact us to
                  register your local chapter&apos;s events.
                </p>
              ) : (
                <>
                  {socialActivities.length > 0 && (
                    <div>
                      <h4 className="mb-3 font-semibold text-orange-900">
                        Social Activities
                      </h4>
                      <div className="space-y-3">
                        {socialActivities.map((event) => (
                          <EventCard key={event.id} event={event} compact />
                        ))}
                      </div>
                    </div>
                  )}

                  {upcomingEvents.length > 0 && (
                    <div>
                      <h4 className="mb-3 font-semibold text-orange-900">
                        Upcoming Events
                      </h4>
                      <div className="space-y-3">
                        {upcomingEvents.map((event) => (
                          <EventCard key={event.id} event={event} compact />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
