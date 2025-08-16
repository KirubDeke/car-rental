'use client';

import Link from 'next/link';
import { CarFront, ChevronDown, User, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from './ThemeProvider';

export default function NavbarPrivate() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white/10 dark:bg-black/10 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo - Left Side */}
        <Link href="/home" className="flex items-center md:flex-1">
          <div className="flex items-center space-x-2 text-2xl font-semibold whitespace-nowrap">
            <CarFront size={42} className="text-gray-900 dark:text-white" />
            <h2 className="text-gray-900 dark:text-white font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Kirub<span className="text-red-600 dark:text-red-400"> Rental</span>
            </h2>
          </div>
        </Link>

        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex flex-1 justify-center">
          <ul className="flex space-x-8 font-medium">
            {['Home', 'Car Fleets', 'About', 'Contact'].map((item) => (
              <li key={item}>
                <Link
                  href={item === 'Home' ? '/home' : item === 'Car Fleets' ? '/fleets' : '#'}
                  className={`${item === 'Home' ? 'text-red-600 dark:text-red-500' : 'text-foreground dark:text-foreground'} hover:text-red-700 dark:hover:text-red-300 transition-colors duration-300 relative group`}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 dark:bg-red-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side - Theme Toggle and Profile Dropdown */}
        <div className="flex items-center md:flex-1 justify-end space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-700" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-300" />
            )}
          </button>

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
                className={`transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''} text-gray-700 dark:text-gray-300`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
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
                <div className="border-t border-gray-200 dark:border-gray-700"></div>
                <button
                  onClick={toggleTheme}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {theme === 'light' ? (
                    <>
                      <Moon size={16} className="mr-2" />
                      Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun size={16} className="mr-2 text-yellow-300" />
                      Light Mode
                    </>
                  )}
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700"></div>
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
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none md:hidden"
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
            {['Home', 'Car Fleets', 'About', 'Contact'].map((item) => (
              <Link
                key={item}
                href={item === 'Home' ? '/home' : item === 'Car Fleets' ? '/fleets' : '#'}
                className={`block py-3 px-4 rounded-lg ${item === 'Home' ? 'bg-red-50 dark:bg-gray-700 text-red-600 dark:text-red-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-300'} font-medium transition-colors duration-200`}
              >
                {item}
              </Link>
            ))}
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
              <button
                onClick={toggleTheme}
                className="flex items-center w-full py-2.5 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-300 font-medium transition-colors duration-200"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-5 h-5 mr-2" />
                    Dark Mode
                  </>
                ) : (
                  <>
                    <Sun className="w-5 h-5 mr-2 text-yellow-300" />
                    Light Mode
                  </>
                )}
              </button>
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