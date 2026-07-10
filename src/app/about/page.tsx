export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-orange-950">About Bhavsar Kshatriya Samaj</h1>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <p>
          The Bhavsar Kshatriya Samaj is a vibrant community with deep roots in Indian
          history and culture. Our samaj traces its lineage to the Kshatriya warrior tradition
          and holds Tulja Bhavani Mata as our guiding deity — a symbol of strength, devotion,
          and protection.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-orange-900">Our Mission</h2>
          <p className="mt-2">
            To unite Bhavsar families across India and abroad, preserve our cultural heritage,
            support education and welfare initiatives, and foster a spirit of seva (selfless
            service) within our community.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-orange-900">What We Do</h2>
          <ul className="mt-2 list-inside list-disc space-y-2">
            <li>Organize state-wise sammelans and cultural gatherings</li>
            <li>Support youth education through scholarships and mentorship</li>
            <li>Coordinate matrimonial and social welfare programs</li>
            <li>Celebrate festivals and religious observances together</li>
            <li>Maintain a directory of active chapters across India</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-orange-900">Community Map</h2>
          <p className="mt-2">
            Our interactive map on the home page lets you explore activities and events in
            every state. Click on any region to see what your local Bhavsar chapter is doing
            and what&apos;s coming up next.
          </p>
        </section>

        <section className="rounded-xl border border-orange-100 bg-orange-50 p-6">
          <p className="font-devanagari text-center text-lg text-orange-800">
            ॐ श्री तुळजा भवानी माता की जय
          </p>
          <p className="mt-2 text-center text-sm text-orange-700">
            Jai Bhavani · Jai Bhavsar Samaj
          </p>
        </section>
      </div>
    </div>
  );
}
