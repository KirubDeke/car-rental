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
    if (initialMode) document.documentElement.classList.add("dark");
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  useEffect(() => {
    if (submitStatus === "success" || submitStatus === "error") {
      const timer = setTimeout(() => setSubmitStatus("idle"), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email address";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.trim().length < 10)
      newErrors.message = "Message should be at least 10 characters long";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/contact`,
        formData
      );
      if (response.status === 200) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        if (formRef.current) formRef.current.reset();
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
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-between items-center mb-8">
            <Link href="/home" className="flex items-center md:flex-1">
              <h2
                style={{ fontFamily: "Orbitron, sans-serif" }}
                className="font-orbitron text-2xl font-extrabold tracking-tight mb-12 text-left md:text-3xl xl:text-4xl text-foreground"
              >
                Get In <span className="text-accent">Touch</span>
              </h2>
            </Link>
          </div>
          <p className="text-xl max-w-3xl mx-auto text-foreground">
            We&apos;d love to hear from you. Send us a message and we&apos;ll
            respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="bg-whiteColor dark:bg-darkColor rounded-2xl shadow-lg p-8 h-full transition-colors duration-300">
              <h2 className="text-2xl font-semibold mb-6 text-foreground">
                Contact Information
              </h2>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start">
                  <div className="bg-accent/20 dark:bg-accent/30 p-3 rounded-lg mr-4">
                    <Mail className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Email</h3>
                    <p className="text-foreground/80">
                      fistumkirubeldeke@gmail.com
                    </p>
                  </div>
                </div>
                {/* Phone */}
                <div className="flex items-start">
                  <div className="bg-accent/20 dark:bg-accent/30 p-3 rounded-lg mr-4">
                    <Phone className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Phone</h3>
                    <p className="text-foreground/80">+251 983716565</p>
                  </div>
                </div>
                {/* Address */}
                <div className="flex items-start">
                  <div className="bg-accent/20 dark:bg-accent/30 p-3 rounded-lg mr-4">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      Addis Ababa, Ethiopia
                    </h3>
                  </div>
                </div>
                {/* Hours */}
                <div className="flex items-start">
                  <div className="bg-accent/20 dark:bg-accent/30 p-3 rounded-lg mr-4">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      Business Hours
                    </h3>
                    <p className="text-foreground/80">
                      Mon-Fri: 9:00 AM - 6:00 PM
                      <br />
                      Sat: 10:00 AM - 4:00 PM
                      <br />
                      Sun: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Socials */}
              <div className="mt-8 pt-6 border-t border-foreground/20">
                <h3 className="font-medium text-foreground mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="bg-darkColor dark:bg-whiteColor hover:bg-accent/20 dark:hover:bg-accent/30 p-3 rounded-lg transition-colors"
                    >
                      <Icon className="w-5 h-5 text-foreground dark:text-foreground" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-whiteColor dark:bg-darkColor rounded-2xl shadow-lg p-8 transition-colors duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-accent/20 dark:bg-accent/30 p-2 rounded-lg mr-4">
                  <MessageSquare className="w-6 h-6 text-accent" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">
                  Send us a Message
                </h2>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {["name", "email"].map((field, idx) => (
                    <div key={idx}>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {field === "name" ? "Full Name *" : "Email Address *"}
                      </label>
                      <input
                        type={field}
                        name={field}
                        value={formData[field as keyof FormData]}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-accent bg-whiteColor dark:bg-darkColor text-foreground border ${
                          errors[field as keyof FormErrors]
                            ? "border-red-500"
                            : "border-foreground/20"
                        }`}
                        placeholder={
                          field === "name"
                            ? "Your full name"
                            : "your.email@example.com"
                        }
                      />
                      {errors[field as keyof FormErrors] && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors[field as keyof FormErrors]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-accent bg-whiteColor dark:bg-darkColor text-foreground border ${
                      errors.subject ? "border-red-500" : "border-foreground/20"
                    }`}
                    placeholder="What is this regarding?"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-accent bg-whiteColor dark:bg-darkColor text-foreground border ${
                      errors.message ? "border-red-500" : "border-foreground/20"
                    }`}
                    placeholder="Please describe your inquiry in detail..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed transition-colors duration-300"
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

                {/* Status */}
                {submitStatus === "success" && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                    <p className="text-green-800 dark:text-green-300">
                      Thank you! Your message has been sent successfully.
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
