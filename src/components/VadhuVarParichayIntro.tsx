import Image from "next/image";

export default function VadhuVarParichayIntro() {
  return (
    <section className="border-t border-orange-100 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 shadow-sm">
          <div className="flex flex-col items-center gap-8 p-6 sm:p-8 lg:flex-row lg:items-start lg:gap-10">
            <div className="relative shrink-0">
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 opacity-40 blur-lg" />
              <div className="relative overflow-hidden rounded-2xl border-4 border-amber-200/80 shadow-lg">
                <Image
                  src="/images/vadhu-var-parichay-president.png"
                  alt="President of Bhavsar Kshatriya Samaj Telangana Vadhu Var Parichay"
                  width={280}
                  height={360}
                  className="h-auto w-56 object-cover object-top sm:w-64"
                />
              </div>
              <p className="mt-3 text-center text-sm font-semibold text-orange-900">
                President
              </p>
              <p className="text-center text-xs text-orange-700">
                Vadhu Var Parichay
              </p>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
                Bhavsar Kshatriya Samaj Telangana
              </p>
              <h2 className="mt-2 text-2xl font-bold text-orange-950 sm:text-3xl">
                Vadhu Var Parichay
              </h2>
              <p className="mt-4 leading-relaxed text-gray-700">
                The Vadhu Var Parichay initiative helps Bhavsar Kshatriya families in
                Telangana connect for matrimonial alliances in a respectful, trusted
                community setting. Guided by our samaj values and the blessings of Tulja
                Bhavani Mata, this program supports eligible brides and grooms in finding
                suitable life partners while preserving our cultural traditions.
              </p>
              <p className="mt-4 leading-relaxed text-gray-700">
                Our president and committee work closely with families across Telangana to
                organize introductions, share verified profiles, and foster meaningful
                connections within the Bhavsar community. We invite members to participate
                and support this seva for the next generation of our samaj.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
