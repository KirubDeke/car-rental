"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Car,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  ArrowRight,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";

// Types
interface Fleet {
  id: string;
  model: string;
  brand: string;
  year: number;
  plateNumber: string;
  type: string;
  pricePerDay: number;
  fuelType: string;
  seats: number;
  transmission: string;
  image: string;
  description: string;
  bookedDates: string[];
}

interface Payment {
  id: string;
  amount: number;
  method: string;
  status: string;
  tx_ref: string;
  paidAt: string;
}

interface Booking {
  id: string;
  userId: string;
  fleetId: string;
  startDate: string;
  endDate: string;
  totalCost: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  pickupLocation: string;
  dropoffLocation: string;
  createdAt: string;
  updatedAt: string;
  fleet: Fleet;
  payment: Payment;
}

const getBookingHistory = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/fleets/bookingHistory`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

const cancelBooking = async (bookingId: string) => {
  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/fleets/cancel-booking/${bookingId}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

// Components
const BookingCard = ({
  booking,
  onCancel,
}: {
  booking: Booking;
  onCancel: (id: string) => void;
}) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      setIsCancelling(true);
      try {
        await cancelBooking(booking.id);
        onCancel(booking.id);
        toast.success("Booking cancelled successfully");
      } catch (error) {
        console.error("Failed to cancel booking:", error);
        toast.error("Failed to cancel booking. Please try again.");
      } finally {
        setIsCancelling(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statusColors = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    confirmed:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    completed:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  const statusIcons = {
    pending: <Clock className="w-4 h-4" />,
    confirmed: <CheckCircle className="w-4 h-4" />,
    completed: <CheckCircle className="w-4 h-4" />,
    cancelled: <XCircle className="w-4 h-4" />,
  };

  const statusText = {
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  const handleViewDetails = () => {
    router.push(`/booking-history/${booking.id}`);
  };

  return (
    <div className="rounded-xl p-6 mb-6 shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-800">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative group">
          <img
            src={
              booking.fleet.image
                ? `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/cars/${booking.fleet.image}`
                : "/placeholder.png"
            }
            alt={booking.fleet.model}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {booking.fleet.brand} {booking.fleet.model}
              </h3>
              <p className="text-gray-600 dark:text-white">
                {booking.fleet.year} • {booking.fleet.plateNumber}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                statusColors[booking.status]
              }`}
            >
              {statusIcons[booking.status]}
              {statusText[booking.status]}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-start gap-2">
              <Calendar className="w-5 h-5 text-white mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 dark:text-white font-medium">
                  Dates
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(booking.startDate)} -{" "}
                  {formatDate(booking.endDate)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-white mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 dark:text-white font-medium">
                  Locations
                </p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {booking.pickupLocation}
                </p>
                <p className="text-sm text-gray-600 dark:text-text-white">
                  to {booking.dropoffLocation}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Car className="w-5 h-5 text-white mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 dark:text-white font-medium">
                  Car Details
                </p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {booking.fleet.fuelType} • {booking.fleet.transmission} •{" "}
                  {booking.fleet.seats} seats
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CreditCard className="w-5 h-5 text-white mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 dark:text-white font-medium">
                  Payment
                </p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {booking.payment?.status === "success" ? "Paid" : "Pending"} •{" "}
                  {booking.payment?.method}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t pt-4 dark:border-gray-700">
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                ${booking.totalCost ? booking.totalCost.toFixed(2) : "0.00"}
              </p>
              <p className="text-sm text-gray-600 dark:text-white">
                Booked on {formatDate(booking.createdAt)}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleViewDetails}
                className="bg-white dark:bg-white px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                View Details
                <ArrowRight className="w-4 h-4" />
              </button>

              {(booking.status === "confirmed" ||
                booking.status === "pending") && (
                <button
                  onClick={handleCancel}
                  disabled={isCancelling}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isCancelling ? "Cancelling..." : "Cancel"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingHistory = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

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

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchBookings();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getBookingHistory();
      setBookings(data.history || []);
    } catch (err) {
      setError("Failed to load bookings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          (booking.fleet.brand?.toLowerCase() || "").includes(term) ||
          (booking.fleet.model?.toLowerCase() || "").includes(term) ||
          (booking.pickupLocation?.toLowerCase() || "").includes(term) ||
          (booking.dropoffLocation?.toLowerCase() || "").includes(term)
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }
    setFilteredBookings(filtered);
  };
  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId ? { ...booking, status: "cancelled" } : booking
      )
    );
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            Authentication Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            Please log in to view your booking history.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => (window.location.href = "/login")}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
        <p className="text-red-800 dark:text-red-400">{error}</p>
        <button
          onClick={fetchBookings}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 px-4">
        <div className="mb-8">
          <div className="w-64 h-64 mx-auto text-gray-300 dark:text-gray-600">
            <Car className="w-full h-full opacity-50" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          No Bookings Yet
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
          You haven&apos;t made any bookings with us yet. Start exploring our fleet
          of vehicles and plan your next adventure!
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <button
            onClick={() => (window.location.href = "/cars")}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
          >
            Browse Available Cars
          </button>
          <button
            onClick={() => (window.location.href = "/offers")}
            className="w-full sm:w-auto px-6 py-3 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors font-medium"
          >
            View Special Offers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Link */}
      <button
        onClick={() => router.push("/home")}
        className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:underline mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </button>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Booking History
          </h1>
          <p className="text-gray-600 dark:text-white mt-2">
            You have {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="w-full md:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-black bg-white dark:bg-white hover:bg-gray-50 dark:hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filter
              {showFilters ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-white mb-2">
              Status
            </p>
            <div className="flex flex-wrap gap-2">
              {["all", "pending", "confirmed", "completed", "cancelled"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      statusFilter === status
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      {filteredBookings.length !== bookings.length && (
        <p className="text-sm text-gray-600 dark:text-white mb-4">
          Showing {filteredBookings.length} of {bookings.length} bookings
        </p>
      )}

      <div className="space-y-6">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancelBooking}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No bookings found
            </h3>
            <p className="text-gray-600 dark:text-white">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Page Component
export default function BookingHistoryPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background text-foreground dark:text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background text-foreground dark:text-foreground py-8">
      <div className="container mx-auto px-4">
        <BookingHistory />
      </div>
    </div>
  );
}
