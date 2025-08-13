'use client';

import Link from 'next/link';
import { CarFront, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function NavbarPrivate() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="bg-white/30 dark:bg-black/30 shadow-sm sticky top-0 z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo - Left Side */}
        <Link href="#" className="flex items-center md:flex-1">
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

        {/* Right Side - Profile Dropdown */}
        <div className="flex items-center md:flex-1 justify-end space-x-4">
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <ChevronDown 
                size={16} 
                className={`transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-100 dark:border-gray-700">
                <Link
                  href="#"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <User size={16} className="mr-2" />
                  Profile
                </Link>
                <Link
                  href="#"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Settings size={16} className="mr-2" />
                  Settings
                </Link>
                <div className="border-t border-gray-100 dark:border-gray-700"></div>
                <Link
                  href="#"
                  className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </Link>
              </div>
            )}
          </div>

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
              <div className="flex items-center px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-3">
                  <img 
                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">John Doe</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">john@example.com</p>
                </div>
              </div>
              <Link
                href="#"
                className="block py-2.5 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-300 font-medium transition-colors duration-200"
              >
                Profile
              </Link>
              <Link
                href="#"
                className="block py-2.5 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-300 font-medium transition-colors duration-200"
              >
                Settings
              </Link>
              <Link
                href="#"
                className="block py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white text-center font-medium transition-colors duration-200 shadow-sm mt-2"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}