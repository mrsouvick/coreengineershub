'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, BookOpen, Youtube, CheckSquare, Award } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Notes & Syllabus', href: '/notes' },
    { name: 'Free Courses', href: '/courses' },
    { name: 'Guidance Hub', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  // If we are in the admin dashboard, we can display a different navbar or hide it
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return null; // Admin dashboard will have its own layout
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-panel shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group" id="nav-logo">
            <div className="bg-primary text-white p-2 rounded-lg group-hover:rotate-12 transition-transform duration-300">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <span className="font-heading font-bold text-xl tracking-tight text-charcoal">
                Core Engineers<span className="text-primary font-extrabold font-sans"> Hub</span>
              </span>
              <p className="text-[10px] text-gray-500 font-medium tracking-wider -mt-1 uppercase">
                MAKAUT Companion Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                id={`nav-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'text-primary bg-primary-light/50 font-semibold'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action CTA */}
          <div className="hidden md:block">
            <a
              href="https://www.youtube.com/@CoreEngineersHub"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-accent hover:bg-accent-dark shadow-sm hover:shadow transition-all duration-200 space-x-1.5"
              id="nav-youtube-cta"
            >
              <Youtube className="h-4.5 w-4.5 fill-current" />
              <span>Subscribe on YouTube</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-primary p-2 rounded-lg focus:outline-none"
              aria-label="Toggle menu"
              id="nav-hamburger"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute left-0 right-0 bg-white border-b border-gray-100 shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? 'top-full opacity-100 visible' : 'top-[-200px] opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                isActive(link.href)
                  ? 'text-primary bg-primary-light/60 font-semibold'
                  : 'text-gray-600 hover:text-primary hover:bg-gray-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 pb-2 border-t border-gray-100 px-3">
            <a
              href="https://www.youtube.com/@CoreEngineersHub"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-white bg-accent hover:bg-accent-dark shadow-sm space-x-2"
            >
              <Youtube className="h-5 w-5 fill-current" />
              <span>Subscribe on YouTube</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
