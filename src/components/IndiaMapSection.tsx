"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import type { Event } from "@/lib/types";
import { getStateName } from "@/lib/states";
import EventCard from "./EventCard";
import EventPhotosPanel from "./EventPhotosPanel";

const IndiaMap = dynamic(() => import("@aryanjsx/indiamap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] items-center justify-center rounded-xl bg-orange-50">
      <p className="text-orange-700">Loading map...</p>
    </div>
  ),
});

const StateDistrictMap = dynamic(() => import("./StateDistrictMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] items-center justify-center rounded-xl bg-orange-50">
      <p className="text-orange-700">Loading district map...</p>
    </div>
  ),
});

interface IndiaMapSectionProps {
  initialEvents?: Event[];
}

export default function IndiaMapSection({ initialEvents = [] }: IndiaMapSectionProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data.events ?? []))
      .catch(() => {});
  }, []);

  const stateName = selectedState ? getStateName(selectedState) : null;

  const regionEvents = selectedState
    ? events.filter((event) => {
        if (event.stateCode !== selectedState) return false;
        if (!selectedDistrict) return true;
        return event.location.toLowerCase().includes(selectedDistrict.toLowerCase());
      })
    : [];

  const socialActivities = regionEvents.filter((e) => e.type === "social_activity");
  const upcomingEvents = regionEvents.filter((e) => e.type === "upcoming_event");

  const handleStateClick = useCallback((stateCode: string) => {
    setSelectedState(stateCode);
    setSelectedDistrict(null);
  }, []);

  const handleDistrictClick = useCallback((district: string) => {
    setSelectedDistrict((prev) => (prev === district ? null : district));
  }, []);

  const handleBackToIndia = useCallback(() => {
    setSelectedState(null);
    setSelectedDistrict(null);
  }, []);

  const regionLabel = selectedDistrict
    ? `${selectedDistrict}, ${stateName}`
    : stateName;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-orange-950">
          {selectedState ? `${stateName} District Map` : "Community Map of India"}
        </h2>
        <p className="mt-2 text-gray-600">
          {selectedState
            ? "Hover over a district to highlight it, then click to explore activities in that area. Use Back to return to the India map."
            : "Hover over a state to highlight it, then click to open its district map and explore Bhavsar Kshatriya Samaj activities."}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-4 shadow-inner">
          {selectedState && (
            <button
              type="button"
              onClick={handleBackToIndia}
              className="absolute left-4 top-4 z-10 flex items-center gap-1 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-semibold text-orange-900 shadow-sm backdrop-blur transition hover:bg-white"
            >
              ← Back to India
            </button>
          )}

          {regionLabel && (
            <div
              className={`absolute z-10 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-semibold text-orange-900 shadow-sm backdrop-blur ${
                selectedState ? "right-4 top-4" : "left-4 top-4"
              }`}
            >
              {regionLabel}
            </div>
          )}

          {selectedState ? (
            <StateDistrictMap
              key={selectedState}
              stateCode={selectedState}
              onClick={handleDistrictClick}
              size="100%"
              mapColor="#fef3c7"
              strokeColor="#c2410c"
              strokeWidth="0.8"
              hoverColor="#ea580c"
            />
          ) : (
            <IndiaMap
              onClick={handleStateClick}
              size="100%"
              mapColor="#fef3c7"
              strokeColor="#c2410c"
              strokeWidth="0.8"
              hoverColor="#ea580c"
            />
          )}
        </div>

        <div className="flex flex-col">
          {!selectedState ? (
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/50 p-8 text-center">
              <div className="text-5xl">🗺️</div>
              <h3 className="mt-4 text-xl font-semibold text-orange-900">
                Select a State
              </h3>
              <p className="mt-2 max-w-sm text-gray-600">
                Click on any state on the map to open its district view and browse social
                activities and upcoming events organized by the Bhavsar Kshatriya Samaj.
              </p>
            </div>
          ) : (
            <div className="space-y-6 overflow-y-auto rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-orange-950">{regionLabel}</h3>
                  <p className="text-sm text-gray-500">
                    {regionEvents.length} activit{regionEvents.length === 1 ? "y" : "ies"}{" "}
                    found
                    {selectedDistrict ? " in this district" : " in this state"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedDistrict) {
                      setSelectedDistrict(null);
                    } else {
                      handleBackToIndia();
                    }
                  }}
                  className="rounded-lg bg-orange-100 px-3 py-1 text-sm text-orange-800 hover:bg-orange-200"
                >
                  {selectedDistrict ? "Clear district" : "Clear"}
                </button>
              </div>

              {!selectedDistrict && (
                <p className="text-sm text-gray-500">
                  Click a district on the map to filter activities for that area.
                </p>
              )}

              {regionEvents.length === 0 ? (
                <p className="text-gray-500">
                  No activities recorded yet for {regionLabel}. Check back soon or contact us
                  to register your local chapter&apos;s events.
                </p>
              ) : (
                <>
                  <EventPhotosPanel events={regionEvents} />

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
