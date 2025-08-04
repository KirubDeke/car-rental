'use client';

import Link from 'next/link';
import { CarFront } from 'lucide-react';
import ButtonOne from './ui/ButtonOne';

export default function NavbarPrivate() {
  return (
    <>
      
      <nav className="bg-background text-foreground px-12">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          {/* Logo section with font applied */}
          <div
            className="flex items-center space-x-2 text-2xl font-semibold whitespace-nowrap dark:text-white"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            <CarFront size={42} />
            <h2>Kirub</h2>
            <span className="text-red-500">Rental</span>
          </div>

          {/* Right side content */}
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <ButtonOne>Contact</ButtonOne>

            <button
              type="button"
              className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded="false"
              data-dropdown-toggle="user-dropdown"
              data-dropdown-placement="bottom"
            >
              <span className="sr-only">Open user menu</span>
              <img className="w-8 h-8 rounded-full" src="/images/profile.jpg" alt="user photo" />
            </button>

            <div
              className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600"
              id="user-dropdown"
            >
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">Bonnie Green</span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                  name@flowbite.com
                </span>
              </div>
              <ul className="py-2" aria-labelledby="user-menu-button">
                <li>
                  <Link
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Settings
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Earnings
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Sign out
                  </Link>
                </li>
              </ul>
            </div>

            <button
              data-collapse-toggle="navbar-user"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-user"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
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

          {/* Navigation menu */}
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
              <li>
                <Link
                  href="#"
                  className="block py-2 px-3 rounded-sm md:bg-transparent md:text-red-500 md:p-0 md:dark:text-red-500"
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="block py-2 px-3 rounded-sm hover:bg-red-500 md:hover:bg-transparent md:hover:text-red-500 md:p-0 md:dark:hover:text-red-400 dark:hover:bg-red-400 dark:hover:text-foreground md:dark:hover:bg-transparent"
                >
                  Car Fleets
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="block py-2 px-3 rounded-sm hover:bg-red-500 md:hover:bg-transparent md:hover:text-red-500 md:p-0 md:dark:hover:text-red-400 dark:hover:bg-red-400 dark:hover:text-foreground md:dark:hover:bg-transparent"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="block py-2 px-3 rounded-sm hover:bg-red-500 md:hover:bg-transparent md:hover:text-red-500 md:p-0 md:dark:hover:text-red-400 dark:hover:bg-red-400 dark:hover:text-foreground md:dark:hover:bg-transparent"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
