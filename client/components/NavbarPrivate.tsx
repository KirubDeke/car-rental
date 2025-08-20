"use client";

import Link from "next/link";
import {
  CarFront,
  ChevronDown,
  User,
  History,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "../context/AuthContext";
import { usePathname } from "next/navigation";

export default function NavbarPrivate() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
  };

  const isActiveLink = (path: string) => {
    if (path === "/home") {
      return pathname === "/home";
    }
    return pathname.startsWith(path);
  };

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "Car Fleets", path: "/fleets" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-white/10 dark:bg-black/10 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo - Left Side */}
        <Link href="/home" className="flex items-center md:flex-1">
          <div className="flex items-center space-x-2 text-2xl font-semibold whitespace-nowrap">
            <CarFront size={42} className="text-gray-900 dark:text-white" />
            <h2
              className="text-gray-900 dark:text-white font-bold"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              Kirub
              <span className="text-red-600 dark:text-red-400"> Rental</span>
            </h2>
          </div>
        </Link>

        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex flex-1 justify-center">
          <ul className="flex space-x-8 font-medium">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className={`${
                    isActiveLink(item.path)
                      ? "text-red-600 dark:text-red-500"
                      : "text-foreground dark:text-foreground"
                  } hover:text-red-700 dark:hover:text-red-300 transition-colors duration-300 relative group`}
                >
                  {item.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-red-600 dark:bg-red-400 transition-all duration-300 ${
                    isActiveLink(item.path) ? "w-full" : "w-0 group-hover:w-full"
                  }`}></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side - Theme Toggle and Profile Dropdown - Hidden on mobile */}
        <div className="hidden md:flex items-center md:flex-1 justify-end space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-100 transition-colors"
            aria-label={`Toggle ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-gray-700" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-300" />
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                {user?.photo ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/users/${user.photo}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                    <User size={20} />
                  </div>
                )}
              </div>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  profileOpen ? "rotate-180" : ""
                } text-gray-700 dark:text-gray-300`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 z-50">
                <Link
                  href={`/profile/${user?.id}`}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <User size={16} className="mr-2" />
                  Profile
                </Link>
                <Link
                  href={`/booking-history`}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <History size={16} className="mr-2" />
                  Booking History
                </Link>
                <button
                  onClick={toggleTheme}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {theme === "light" ? (
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
                <div className="border-t border-gray-100 dark:border-gray-700"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button - Always visible on mobile */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
            aria-expanded={menuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                menuOpen ? "rotate-90" : ""
              }`}
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
          className={`${
            menuOpen ? "block" : "hidden"
          } w-full md:hidden transition-all duration-300 ease-in-out`}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-4 p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`block py-3 px-4 rounded-lg ${
                  isActiveLink(item.path)
                    ? "bg-red-50 dark:bg-gray-700 text-red-600 dark:text-red-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-300"
                } font-medium transition-colors duration-200`}
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-3">
                  {user?.photo ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/users/${user.photo}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="text-gray-500" size={20} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.fullName || "Guest"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email || "Not signed in"}
                  </p>
                </div>
              </div>

              <Link
                href={`/profile/${user?.id}`}
                className="block py-2.5 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-300 font-medium transition-colors duration-200"
              >
                Profile
              </Link>
              <Link
                href={`/booking-history`}
                className="block py-2.5 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-300 font-medium transition-colors duration-200"
              >
                Booking History
              </Link>
              {/* Theme Toggle in Mobile Menu */}
              <button
                onClick={toggleTheme}
                className="flex items-center w-full py-2.5 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-300 font-medium transition-colors duration-200"
              >
                {theme === "light" ? (
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
              <button
                onClick={() => handleLogout()}
                className="block py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white text-center font-medium transition-colors duration-200 shadow-sm mt-2"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}