"use client";

import { useMemo, useState } from "react";
import type { Event, EventImage } from "@/lib/types";

interface GalleryItem {
  image: EventImage;
  event: Event;
}

interface EventPhotoGalleryProps {
  events: Event[];
  title?: string;
  description?: string;
  limit?: number;
  showViewAllLink?: boolean;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function EventPhotoGallery({
  events,
  title = "Event Photos",
  description = "Highlights from our community gatherings, cultural programs, and social activities across India.",
  limit,
  showViewAllLink = false,
}: EventPhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const galleryItems = useMemo(() => {
    const items: GalleryItem[] = [];
    for (const event of events) {
      for (const image of event.images) {
        items.push({ image, event });
      }
    }
    items.sort(
      (a, b) =>
        new Date(b.image.createdAt).getTime() - new Date(a.image.createdAt).getTime(),
    );
    return limit ? items.slice(0, limit) : items;
  }, [events, limit]);

  const totalPhotos = useMemo(
    () => events.reduce((count, event) => count + event.images.length, 0),
    [events],
  );

  if (galleryItems.length === 0) {
    return (
      <section className="border-t border-orange-100 bg-gradient-to-b from-orange-50/50 to-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-orange-950">{title}</h2>
            <p className="mt-2 text-gray-600">{description}</p>
            <div className="mx-auto mt-8 max-w-md rounded-2xl border-2 border-dashed border-orange-200 bg-white p-8">
              <div className="text-4xl">📸</div>
              <p className="mt-3 text-gray-500">
                Event photos will appear here once uploaded by chapter organizers.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const activeItem = lightboxIndex !== null ? galleryItems[lightboxIndex] : null;

  return (
    <>
      <section className="border-t border-orange-100 bg-gradient-to-b from-orange-50/50 to-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-orange-950">{title}</h2>
              <p className="mt-2 text-gray-600">{description}</p>
            </div>
            {showViewAllLink && limit && totalPhotos > limit && (
              <a
                href="/events#photos"
                className="text-sm font-medium text-orange-600 hover:text-orange-800"
              >
                View all {totalPhotos} photos →
              </a>
            )}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
            {galleryItems.map((item, index) => (
              <button
                key={item.image.id}
                type="button"
                onClick={() => setLightboxIndex(index)}
                className="group relative aspect-square overflow-hidden rounded-xl border border-orange-100 bg-orange-50 text-left shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image.url}
                  alt={item.image.caption ?? item.event.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="truncate text-sm font-semibold text-white">
                    {item.event.title}
                  </p>
                  <p className="truncate text-xs text-white/80">
                    {item.event.location} · {formatDate(item.event.date)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeItem && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20"
          >
            Close
          </button>

          {lightboxIndex > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex - 1);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20"
              aria-label="Previous photo"
            >
              ←
            </button>
          )}

          {lightboxIndex < galleryItems.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex + 1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20"
              aria-label="Next photo"
            >
              →
            </button>
          )}

          <div
            className="max-h-[85vh] max-w-4xl overflow-hidden rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeItem.image.url}
              alt={activeItem.image.caption ?? activeItem.event.title}
              className="max-h-[70vh] w-full object-contain"
            />
            <div className="bg-white px-5 py-4">
              <p className="font-semibold text-orange-950">{activeItem.event.title}</p>
              {activeItem.image.caption && (
                <p className="mt-1 text-sm text-gray-600">{activeItem.image.caption}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                {activeItem.event.location} · {formatDate(activeItem.event.date)}
              </p>
              <p className="mt-1 text-xs text-orange-600">
                {lightboxIndex + 1} of {galleryItems.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
