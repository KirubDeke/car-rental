import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, CarFront } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-background dark:bg-background text-foreground dark:text-foreground border-t border-gray-600 dark:border-gray-800">
            <div className="max-w-screen-xl px-4 py-12 mx-auto sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    {/* Logo and description */}
                    <div className="lg:col-span-2">
                        <div
                            className="flex items-center space-x-2 text-2xl font-semibold whitespace-nowrap dark:text-white"
                            style={{ fontFamily: 'Orbitron, sans-serif' }}
                        >
                            <CarFront size={42} />
                            <h2>Kirub</h2>
                            <span className="text-red-500">Rental</span>
                        </div>
                        <p className="max-w-md mt-4 text-gray-600 dark:text-white">
                            Your trusted partner for premium car rentals. Drive with confidence and style.
                        </p>

                        <div className="flex mt-6 space-x-6">
                            <Link href="/contact" className="text-gray-500 dark:text-white hover:text-red-500 dark:hover:text-red-400 transition">
                                <Facebook className="w-6 h-6" />
                            </Link>
                            <Link href="/contact" className="text-gray-500 dark:text-white hover:text-red-500 dark:hover:text-red-400 transition">
                                <Twitter className="w-6 h-6" />
                            </Link>
                            <Link href="/contact" className="text-gray-500 dark:text-white hover:text-red-500 dark:hover:text-red-400 transition">
                                <Instagram className="w-6 h-6" />
                            </Link>
                            <Link href="/contact" className="text-gray-500 dark:text-white hover:text-red-500 dark:hover:text-red-400 transition">
                                <Linkedin className="w-6 h-6" />
                            </Link>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-lg font-semibold">Quick Links</h3>
                        <nav className="flex flex-col mt-4 space-y-2">
                            <Link href="/contact" className="text-gray-600 hover:text-red-500 dark:text-white dark:hover:text-red-400 transition">
                                Contact Us
                            </Link>
                        </nav>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold">Contact Us</h3>
                        <div className="flex flex-col mt-4 space-y-2 text-gray-600 dark:text-white">
                            <p>Addis Ababa, Ethiopia</p>
                            <p>Phone: +(251) 983716565</p>
                            <p>Email: fistumkirubeldeke@gmail.com</p>
                        </div>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col items-center justify-between md:flex-row">
                        <p className="text-sm text-gray-500 dark:text-white">
                            © {new Date().getFullYear()} Kirub Car Rental. All rights reserved.
                        </p>

                        <div className="flex mt-4 space-x-6 md:mt-0">
                            <Link href="/contact" className="text-sm text-gray-500 dark:text-white hover:text-red-500 dark:hover:text-red-400 transition">
                                Privacy Policy
                            </Link>
                            <Link href="/contact" className="text-sm text-gray-500 dark:text-white hover:text-red-500 dark:hover:text-red-400 transition">
                                Terms of Service
                            </Link>
                            <Link href="/contact" className="text-sm text-gray-500 dark:text-white hover:text-red-500 dark:hover:text-red-400 transition">
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;