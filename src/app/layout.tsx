import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { Playfair_Display, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bhavsar Kshatriya Samaj | Community Portal",
  description:
    "Official portal of the Bhavsar Kshatriya Samaj — explore community activities, upcoming events, and connect with chapters across India.",
  openGraph: {
    title: "Bhavsar Kshatriya Samaj",
    description: "Unity · Service · Heritage",
    url: "https://bhavsarprojects.com",
    siteName: "Bhavsar Kshatriya Samaj",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${notoDevanagari.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-amber-50/30 font-sans text-gray-900 antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
