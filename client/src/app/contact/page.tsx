"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Sun,
  Moon,
  CarFront,
} from "lucide-react";
import toast from "react-hot-toast";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [darkMode, setDarkMode] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialMode = savedTheme ? savedTheme === "dark" : systemDark;
    setDarkMode(initialMode);
    if (initialMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  useEffect(() => {
    if (submitStatus === "success" || submitStatus === "error") {
      const timer = setTimeout(() => {
        setSubmitStatus("idle");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/contact`, formData);
      
      if (response.status === 200) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });

        if (formRef.current) {
          formRef.current.reset();
        }
        toast.success("Message sent successfully");
      } else {
        toast.error("Failed to send message");
        throw new Error("Server returned an error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background py-12 px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex justify-between items-center mb-8">
            <Link href="/home" className="flex items-center md:flex-1">
              <div className="flex items-center space-x-2 text-2xl font-semibold whitespace-nowrap">
                <h2
                  className="text-foreground dark:text-foreground font-bold"
                  style={{ fontFamily: "Orbitron, sans-serif" }}
                >
                  Get
                  <span className="text-red-600 dark:text-red-500">
                    {" "}
                    In Touch
                  </span>
                </h2>
              </div>
            </Link>
          </div>
          <p className="text-xl text-foreground dark:text-foreground max-w-3xl mx-auto">
            We&apos;d love to hear from
            you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 h-full">
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">
                Contact Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg mr-4">
                    <Mail className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800 dark:text-white">
                      Email
                    </h3>
                    <p className="text-slate-600 dark:text-white">
                      fistumkirubeldeke@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg mr-4">
                    <Phone className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800 dark:text-white">
                      Phone
                    </h3>
                    <p className="text-slate-600 dark:text-white">
                      +251 983716565
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg mr-4">
                    <MapPin className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800 dark:text-white">
                      Addis Ababa, Ethiopia
                    </h3>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg mr-4">
                    <Clock className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800 dark:text-white">
                      Business Hours
                    </h3>
                    <p className="text-slate-600 dark:text-white">
                      Mon-Fri: 9:00 AM - 6:00 PM
                      <br />
                      Sat: 10:00 AM - 4:00 PM
                      <br />
                      Sun: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <h3 className="font-medium text-slate-800 dark:text-white mb-4">
                  Follow Us
                </h3>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="bg-slate-100 dark:bg-slate-700 hover:bg-red-100 dark:hover:bg-red-900/30 p-3 rounded-lg transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </a>
                  <a
                    href="#"
                    className="bg-slate-100 dark:bg-slate-700 hover:bg-red-100 dark:hover:bg-red-900/30 p-3 rounded-lg transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </a>
                  <a
                    href="#"
                    className="bg-slate-100 dark:bg-slate-700 hover:bg-red-100 dark:hover:bg-red-900/30 p-3 rounded-lg transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </a>
                  <a
                    href="#"
                    className="bg-slate-100 dark:bg-slate-700 hover:bg-red-100 dark:hover:bg-red-900/30 p-3 rounded-lg transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg mr-4">
                  <MessageSquare className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
                  Send us a Message
                </h2>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-700 dark:text-white mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                        errors.name
                          ? "border-red-500"
                          : "border-slate-300 dark:border-slate-600"
                      } bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-foreground`}
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 dark:text-white mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                        errors.email
                          ? "border-red-500"
                          : "border-slate-300 dark:border-slate-600"
                      } bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-foreground`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-slate-700 dark:text-white mb-2"
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                      errors.subject
                        ? "border-red-500"
                        : "border-slate-300 dark:border-slate-600"
                    } bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-foreground`}
                    placeholder="What is this regarding?"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-slate-700 dark:text-white mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                      errors.message
                        ? "border-red-500"
                        : "border-slate-300 dark:border-slate-600"
                    } bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-foreground`}
                    placeholder="Please describe your inquiry in detail..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>

                {/* Status Messages */}
                {submitStatus === "success" && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                    <p className="text-green-800 dark:text-green-300">
                      Thank you! Your message has been sent successfully. We&apos;ll
                      get back to you soon.
                    </p>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                    <p className="text-red-800 dark:text-red-300">
                      Sorry, there was an error sending your message. Please try
                      again later.
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}