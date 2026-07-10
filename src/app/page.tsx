import Image from "next/image";
import Link from "next/link";
import IndiaMapSection from "@/components/IndiaMapSection";
import { readEvents } from "@/lib/db";
import EventCard from "@/components/EventCard";
import EventPhotoGallery from "@/components/EventPhotoGallery";

export default async function HomePage() {
  const events = await readEvents();
  const upcoming = events
    .filter((e) => e.type === "upcoming_event")
    .slice(0, 3);

  return (
    <>
      {/* Hero with Tulja Bhavani Mata */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-900 via-red-900 to-orange-950">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(251,191,36,0.3),_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_rgba(234,88,12,0.2),_transparent_50%)]" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:gap-12 lg:px-8 lg:py-20">
          <div className="relative shrink-0">
            <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 opacity-60 blur-xl" />
            <div className="relative overflow-hidden rounded-2xl border-4 border-amber-300/50 shadow-2xl">
              <Image
                src="/images/Tulja_bhavani.jpeg"
                alt="Tulja Bhavani Mata — presiding deity of the Bhavsar Kshatriya Samaj"
                width={320}
                height={400}
                priority
                className="h-auto w-64 object-cover sm:w-72 lg:w-80"
              />
            </div>
          </div>

          <div className="text-center lg:text-left">
            <p className="font-devanagari text-lg text-amber-200/90 sm:text-xl">
              ॐ श्री तुळजा भवानी माता की जय
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-amber-50 sm:text-5xl lg:text-6xl">
              Bhavsar Kshatriya Samaj
            </h1>
            <p className="mt-4 max-w-xl text-lg text-amber-100/80">
              Welcome to our community portal. Discover social activities, cultural events,
              and connect with Bhavsar families across every state of India.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
              <Link
                href="#map"
                className="rounded-xl bg-amber-500 px-6 py-3 font-semibold text-orange-950 shadow-lg transition hover:bg-amber-400"
              >
                Explore Community Map
              </Link>
              <Link
                href="/events"
                className="rounded-xl border-2 border-amber-300/50 px-6 py-3 font-semibold text-amber-100 transition hover:bg-amber-300/10"
              >
                View All Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-orange-100 bg-white py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
          {[
            { label: "States Connected", value: "28+" },
            { label: "Community Events", value: `${events.length}+` },
            { label: "Years of Heritage", value: "Centuries" },
            { label: "Active Chapters", value: "Growing" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-orange-700">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Map */}
      <div id="map">
        <IndiaMapSection initialEvents={events} />
      </div>

      {/* Event photo gallery */}
      <div id="photos">
        <EventPhotoGallery events={events} limit={8} showViewAllLink />
      </div>

      {/* Upcoming events preview */}
      {upcoming.length > 0 && (
        <section className="border-t border-orange-100 bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-orange-950">Upcoming Events</h2>
              <Link href="/events" className="text-sm font-medium text-orange-600 hover:text-orange-800">
                View all →
              </Link>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
