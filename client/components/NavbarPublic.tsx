"use client";

import Link from "next/link";
import { CarFront, Sun, Moon } from "lucide-react";
import { useState } from "react";
import ButtonOne from "./ui/ButtonOne";
import { useRouter } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { usePathname } from "next/navigation";

export default function NavbarPublic() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

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
            <CarFront
              size={42}
              className="text-foreground dark:text-foreground"
            />
            <h2
              className="text-foreground dark:text-foreground font-bold"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              Kirub
              <span className="text-red-600 dark:text-red-500"> Rental</span>
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

        {/* Right Side - Theme Toggle and Sign In */}
        <div className="flex items-center md:flex-1 justify-end space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={`Toggle ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-gray-700" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-300" />
            )}
          </button>

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
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none md:hidden"
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
              <Link
                href="/signup"
                className="block py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white text-center font-medium transition-colors duration-200 shadow-sm mt-2"
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