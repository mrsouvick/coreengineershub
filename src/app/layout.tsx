import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Core Engineers Hub — MAKAUT Free Notes, Suggestions & Courses",
  description: "Free study companion platform for MAKAUT engineering students. Get semester-wise notes, previous year solved papers (PYQs), exam suggestions, roadmaps, and free video tutorials.",
  keywords: "MAKAUT notes, Maulana Abul Kalam Azad University of Technology, CSE notes, MAKAUT suggestions, ECE PYQ, ME syllabus, Core Engineers Hub, engineering lectures",
  openGraph: {
    title: "Core Engineers Hub — MAKAUT Free Notes, Suggestions & Courses",
    description: "Free study companion platform for MAKAUT engineering students. Get semester-wise notes, PYQs, suggestions, roadmaps, and free tutorials.",
    url: "https://coreengineershub.in",
    siteName: "Core Engineers Hub",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Navbar />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
