'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Youtube, MessageSquare, Send, Globe, Lock } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return null; // Admin dashboard handles its own footer
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Tagline / branding */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-primary text-white p-2 rounded-lg">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="font-heading font-bold text-lg tracking-tight text-white">
                Core Engineers<span className="text-primary-light font-extrabold font-sans"> Hub</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed">
              A free academic companion platform built for MAKAUT engineering students. Providing high-quality structured notes, suggestions, playlist guides, and career roadmaps to clear backlogs and score 8.5+ SGPA.
            </p>
            {/* Social channels */}
            <div className="flex space-x-4 pt-2">
              <a
                href="https://www.youtube.com/@CoreEngineersHub"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-red-600 text-gray-400 hover:text-white p-2.5 rounded-lg transition-colors duration-200"
                aria-label="YouTube Channel"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://t.me/CoreEngineersHub" // Placeholder telegram link
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-blue-500 text-gray-400 hover:text-white p-2.5 rounded-lg transition-colors duration-200"
                aria-label="Telegram Channel"
              >
                <Send className="h-5 w-5" />
              </a>
              <a
                href="https://chat.whatsapp.com/CoreEngineersHub" // Placeholder WhatsApp community
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-green-600 text-gray-400 hover:text-white p-2.5 rounded-lg transition-colors duration-200"
                aria-label="WhatsApp Community"
              >
                <MessageSquare className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-heading font-semibold text-white text-sm tracking-wider uppercase mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/notes" className="hover:text-primary-light transition-colors">
                  Notes & Syllabus
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-primary-light transition-colors">
                  Free Video Courses
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary-light transition-colors">
                  Guidance & Roadmaps
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary-light transition-colors">
                  About Platform
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Portal */}
          <div>
            <h3 className="font-heading font-semibold text-white text-sm tracking-wider uppercase mb-4">
              Support
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/contact" className="hover:text-primary-light transition-colors">
                  Contact Form
                </Link>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@CoreEngineersHub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-light transition-colors"
                >
                  YouTube Live Q&A
                </a>
              </li>
              <li className="pt-4 border-t border-gray-800">
                <Link
                  href="/admin"
                  className="inline-flex items-center space-x-1.5 text-xs text-gray-500 hover:text-primary-light transition-colors font-medium"
                >
                  <Lock className="h-3 w-3" />
                  <span>Admin Panel Login</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>
            &copy; {currentYear} Core Engineers Hub. All Rights Reserved. Built for MAKAUT students.
          </p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Made with passion for engineering education</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
