'use client';

import Link from 'next/link';
import { CarFront } from 'lucide-react';
import { useState } from 'react';
import ButtonOne from './ui/ButtonOne';
import { useRouter } from 'next/navigation';

export default function NavbarPrivate() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="bg-white/30 dark:bg-black/30 sticky top-0 z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo - Left Side */}
        <Link href="/home" className="flex items-center md:flex-1">
          <div className="flex items-center space-x-2 text-2xl font-semibold whitespace-nowrap">
            <CarFront size={42} className="text-foreground dark:text-foreground" />
            <h2 className="text-gray-800 dark:text-white font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Kirub<span className="text-red-600 dark:text-red-500"> Rental</span>
            </h2>
          </div>
        </Link>

        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex flex-1 justify-center">
          <ul className="flex space-x-8 font-medium">
            <li>
              <Link
                href="/home"
                className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors duration-300 relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 dark:bg-red-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link
                href="/fleets"
                className="text-gray-800 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300 relative group"
              >
                Car Fleets
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 dark:bg-red-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-gray-800 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300 relative group"
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 dark:bg-red-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-gray-800 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300 relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 dark:bg-red-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Side - Sign In Button */}
        <div className="flex items-center md:flex-1 justify-end space-x-4">
          <ButtonOne
          onClick={() => router.push("/signup")}
            className="hidden md:block px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-300 font-medium shadow-sm"
          >
            Sign In
          </ButtonOne>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 md:hidden"
            aria-expanded={menuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${menuOpen ? 'rotate-90' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${menuOpen ? 'block' : 'hidden'} w-full md:hidden transition-all duration-300 ease-in-out`}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-4 p-4 space-y-2">
            <Link
              href="#"
              className="block py-3 px-4 rounded-lg bg-red-50 dark:bg-gray-700 text-red-600 dark:text-red-400 font-medium"
            >
              Home
            </Link>
            <Link
              href="#"
              className="block py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-300 font-medium transition-colors duration-200"
            >
              Car Fleets
            </Link>
            <Link
              href="#"
              className="block py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-300 font-medium transition-colors duration-200"
            >
              About
            </Link>
            <Link
              href="#"
              className="block py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-300 font-medium transition-colors duration-200"
            >
              Contact
            </Link>
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="#"
                className="block py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white text-center font-medium transition-colors duration-200 shadow-sm"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}