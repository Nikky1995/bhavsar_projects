import type { Event } from "@/lib/types";

interface EventCardProps {
  event: Event;
  compact?: boolean;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const typeLabels: Record<Event["type"], string> = {
  social_activity: "Social Activity",
  upcoming_event: "Upcoming Event",
  past_event: "Past Event",
};

const typeColors: Record<Event["type"], string> = {
  social_activity: "bg-blue-100 text-blue-800",
  upcoming_event: "bg-green-100 text-green-800",
  past_event: "bg-gray-100 text-gray-600",
};

export default function EventCard({ event, compact = false }: EventCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      {event.images.length > 0 && (
        <div className={`relative ${compact ? "h-32" : "h-48"} w-full overflow-hidden bg-orange-50`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.images[0].url}
            alt={event.images[0].caption ?? event.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[event.type]}`}>
            {typeLabels[event.type]}
          </span>
          <span className="text-xs text-orange-600">{event.state}</span>
        </div>
        <h3 className={`font-semibold text-orange-950 ${compact ? "text-base" : "text-lg"}`}>
          {event.title}
        </h3>
        {!compact && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{event.description}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
          <span>📅 {formatDate(event.date)}</span>
          <span>📍 {event.location}</span>
        </div>
        {event.images.length > 1 && (
          <p className="mt-2 text-xs text-orange-600">
            +{event.images.length - 1} more photo{event.images.length > 2 ? "s" : ""}
          </p>
        )}
      </div>
    </article>
  );
}
