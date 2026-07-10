import type { Event } from "@/lib/types";

interface EventPhotosPanelProps {
  events: Event[];
}

export default function EventPhotosPanel({ events }: EventPhotosPanelProps) {
  const items = events.flatMap((event) =>
    event.images.map((image) => ({ image, event })),
  );

  if (items.length === 0) return null;

  return (
    <div>
      <h4 className="mb-3 font-semibold text-orange-900">Event Photos</h4>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map(({ image, event }) => (
          <figure
            key={image.id}
            className="overflow-hidden rounded-lg border border-orange-100 bg-orange-50"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={image.caption ?? event.title}
              className="aspect-square w-full object-cover"
            />
            {(image.caption || event.title) && (
              <figcaption className="truncate px-2 py-1.5 text-xs text-gray-600">
                {image.caption ?? event.title}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}
