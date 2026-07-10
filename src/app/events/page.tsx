import EventCard from "@/components/EventCard";
import EventPhotoGallery from "@/components/EventPhotoGallery";
import { readEvents } from "@/lib/db";

export default async function EventsPage() {
  const events = await readEvents();
  const upcoming = events.filter((e) => e.type === "upcoming_event");
  const social = events.filter((e) => e.type === "social_activity");
  const past = events.filter((e) => e.type === "past_event");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-orange-950">Events & Activities</h1>
      <p className="mt-2 text-gray-600">
        Browse all community events and social activities organized by the Bhavsar Kshatriya Samaj.
      </p>

      {upcoming.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-orange-900">Upcoming Events</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {social.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-orange-900">Social Activities</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {social.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-orange-900">Past Events</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {events.length === 0 && (
        <p className="mt-10 text-center text-gray-500">
          No events listed yet. Check back soon!
        </p>
      )}

      <div id="photos" className="-mx-4 mt-12 sm:-mx-6 lg:-mx-8">
        <EventPhotoGallery
          events={events}
          title="Community Photo Gallery"
          description="Browse photos from Bhavsar Kshatriya Samaj events and social activities."
        />
      </div>
    </div>
  );
}
