import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-amber-200/60 bg-gradient-to-r from-orange-900 to-red-900 text-amber-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold">Bhavsar Kshatriya Samaj</h3>
            <p className="mt-2 text-sm text-amber-100/80">
              Connecting our community across India through social activities,
              cultural events, and shared heritage.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="mt-2 space-y-1 text-sm text-amber-100/80">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/events" className="hover:text-white">Events</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Connect</h4>
            <p className="mt-2 text-sm text-amber-100/80">
              Email: contact@bhavsarprojects.com
            </p>
            <p className="text-sm text-amber-100/80">
              Website: bhavsarprojects.com
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-amber-100/20 pt-6 text-center text-sm text-amber-100/60">
          © {new Date().getFullYear()} Bhavsar Kshatriya Samaj. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
