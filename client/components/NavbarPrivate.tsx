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

  const handleLogout = async () => await logout();

  const isActiveLink = (path: string) =>
    path === "/home" ? pathname === "/home" : pathname.startsWith(path);

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "Car Fleets", path: "/fleets" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-whiteColor/10 dark:bg-darkColor/10 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link href="/home" className="flex items-center md:flex-1">
          <div className="flex items-center space-x-2 text-2xl font-semibold whitespace-nowrap">
            <CarFront size={42} className="text-foreground" />
            <h2
              className="text-foreground font-bold"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              Kirub
              <span className="text-accent"> Rental</span>
            </h2>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center">
          <ul className="flex space-x-8 font-medium">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className={`${
                    isActiveLink(item.path) ? "text-accent" : "text-foreground"
                  } hover:text-accent transition-colors duration-300 relative group`}
                >
                  {item.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${
                      isActiveLink(item.path)
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center md:flex-1 justify-end space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-whiteColor/20 dark:hover:bg-darkColor/20 transition-colors"
            aria-label={`Toggle ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-foreground" />
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
              <div className="w-10 h-10 rounded-full bg-whiteColor/20 dark:bg-darkColor/20 overflow-hidden flex items-center justify-center">
                {user?.photo ? (
                  <img
                    src={user.photo}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={20} className="text-foreground" />
                )}
              </div>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  profileOpen ? "rotate-180" : ""
                } text-foreground`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-whiteColor dark:bg-darkColor rounded-md shadow-lg py-1 z-50">
                <Link
                  href={`/profile/${user?.id}`}
                  className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-white/20 dark:hover:bg-darkColor/20 rounded-md transition-colors"
                >
                  <User size={16} className="mr-2" /> Profile
                </Link>
                <Link
                  href={`/booking-history`}
                  className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-white/20 dark:hover:bg-darkColor/20 rounded-md transition-colors"
                >
                  <History size={16} className="mr-2" /> Booking History
                </Link>
                <button
                  onClick={toggleTheme}
                  className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-white/20 dark:hover:bg-darkColor/20 rounded-md transition-colors"
                >
                  {theme === "light" ? (
                    <>
                      <Moon size={16} className="mr-2" /> Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun size={16} className="mr-2 text-yellow-300" /> Light
                      Mode
                    </>
                  )}
                </button>
                <div className="border-t border-darkColor my-1"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm text-accent hover:text-red-500 hover:bg-white/20 dark:hover:bg-darkColor/20 rounded-md transition-colors"
                >
                  <LogOut size={16} className="mr-2" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center rounded-lg hover:bg-whiteColor/20 dark:hover:bg-darkColor/20 focus:outline-none"
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
          <div className="bg-whiteColor/90 dark:bg-darkColor/90 backdrop-blur-md rounded-lg shadow-lg mt-4 p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`block py-3 px-4 rounded-lg ${
                  isActiveLink(item.path)
                    ? "bg-accent/20 text-accent"
                    : "text-foreground hover:bg-whiteColor/20 dark:hover:bg-darkColor/20"
                } font-medium transition-colors duration-200`}
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-2 border-t border-darkColor">
              <div className="flex items-center px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-whiteColor/20 dark:bg-darkColor/20 overflow-hidden mr-3 flex items-center justify-center">
                  {user?.photo ? (
                    <img
                      src={user.photo}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="text-foreground" size={20} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {user?.fullName || "Guest"}
                  </p>
                  <p className="text-xs text-foreground/70">
                    {user?.email || "Not signed in"}
                  </p>
                </div>
              </div>

              <Link
                href={`/profile/${user?.id}`}
                className="block py-2.5 px-4 rounded-lg hover:bg-whiteColor/20 dark:hover:bg-darkColor/20 text-foreground font-medium transition-colors duration-200"
              >
                Profile
              </Link>
              <Link
                href={`/booking-history`}
                className="block py-2.5 px-4 rounded-lg hover:bg-whiteColor/20 dark:hover:bg-darkColor/20 text-foreground font-medium transition-colors duration-200"
              >
                Booking History
              </Link>
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center w-full py-2.5 px-4 rounded-lg hover:bg-whiteColor/20 dark:hover:bg-darkColor/20 text-foreground font-medium transition-colors duration-200"
              >
                {theme === "light" ? (
                  <>
                    <Moon className="w-5 h-5 mr-2" /> Dark Mode
                  </>
                ) : (
                  <>
                    <Sun className="w-5 h-5 mr-2 text-yellow-300" /> Light Mode
                  </>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="block py-2.5 px-4 rounded-lg bg-accent hover:bg-red-700 text-white text-center font-medium transition-colors duration-200 shadow-sm mt-2"
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
