"use client";

import { useState, useEffect, JSX } from "react";
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
  ArrowLeft,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Sparkles,
  PartyPopper,
} from "lucide-react";
import toast from "react-hot-toast";
import ButtonOne from "../../../components/ui/ButtonOne";
import ButtonTwo from "../../../components/ui/ButtonTwo";

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
  amount: number | string;
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
  totalCost: number | string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  pickupLocation: string;
  dropoffLocation: string;
  createdAt: string;
  updatedAt: string;
  fleet: Fleet;
  payment: Payment | null;
}

const getBookingHistory = async (): Promise<{ history: Booking[] }> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/fleets/bookingHistory`,
    { withCredentials: true }
  );
  return response.data;
};

const cancelBooking = async (bookingId: string): Promise<void> => {
  await axios.delete(
    `${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/fleets/cancel-booking/${bookingId}`,
    { withCredentials: true }
  );
};

interface BookingCardProps {
  booking: Booking;
  onCancel: (id: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel }) => {
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const router = useRouter();

  const handleCancel = async () => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      setIsCancelling(true);
      try {
        await cancelBooking(booking.id);
        onCancel(booking.id);
        toast.success("Booking cancelled successfully");
      } catch {
        toast.error("Failed to cancel booking. Please try again.");
      } finally {
        setIsCancelling(false);
      }
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statusColors: Record<string, string> = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    confirmed:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    completed:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  const statusIcons: Record<string, JSX.Element> = {
    pending: <Clock className="w-4 h-4" />,
    confirmed: <CheckCircle className="w-4 h-4" />,
    completed: <CheckCircle className="w-4 h-4" />,
    cancelled: <XCircle className="w-4 h-4" />,
  };

  const statusText: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  const totalCost =
    typeof booking.totalCost === "number"
      ? booking.totalCost.toFixed(2)
      : booking.totalCost;
  const paymentAmount = booking.payment?.amount
    ? typeof booking.payment.amount === "number"
      ? booking.payment.amount.toFixed(2)
      : booking.payment.amount
    : "0.00";

  const handleViewDetails = () => router.push(`/booking-history/${booking.id}`);

  return (
    <div className="rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 bg-whiteColor dark:bg-darkColor text-foreground">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 h-48 rounded-lg overflow-hidden flex items-center justify-center">
          {booking.fleet?.image ? (
            <img
              src={booking.fleet.image}
              alt={booking.fleet.model}
              className="w-full h-full object-cover"
            />
          ) : (
            <Car className="w-16 h-16 text-gray-400 dark:text-gray-500" />
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {booking.fleet.brand} {booking.fleet.model}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {booking.fleet.year} • {booking.fleet.plateNumber}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                  statusColors[booking.status]
                }`}
              >
                {statusIcons[booking.status]} {statusText[booking.status]}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-foreground">
              <div className="flex items-start gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-sm font-medium">Dates</p>
                  <p className="font-medium">
                    {formatDate(booking.startDate)} -{" "}
                    {formatDate(booking.endDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-sm font-medium">Locations</p>
                  <p className="text-sm">{booking.pickupLocation}</p>
                  <p className="text-sm">to {booking.dropoffLocation}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Car className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-sm font-medium">Car Details</p>
                  <p className="text-sm">
                    {booking.fleet.fuelType} • {booking.fleet.transmission} •{" "}
                    {booking.fleet.seats} seats
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CreditCard className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-sm font-medium">Payment</p>
                  <p className="text-sm">
                    ETB {paymentAmount} • {booking.payment?.method || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-darkColor mt-4 flex-wrap gap-2">
            <div>
              <p className="text-lg font-bold text-foreground">
                ETB {totalCost}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Booked on {formatDate(booking.createdAt)}
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <ButtonOne onClick={handleViewDetails}>View Details</ButtonOne>
              {(booking.status === "confirmed" ||
                booking.status === "pending") && (
                <ButtonTwo onClick={handleCancel} disabled={isCancelling}>
                  {isCancelling ? "Cancelling..." : "Cancel"}
                </ButtonTwo>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const showConfirmationToast = (booking: Booking) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-whiteColor dark:bg-darkColor shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                <PartyPopper className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-foreground">
                Booking Confirmed! 🎉
              </p>
              <p className="mt-1 text-sm text-foreground/70">
                Your {booking.fleet.brand} {booking.fleet.model} is reserved
                from {new Date(booking.startDate).toLocaleDateString()} to{" "}
                {new Date(booking.endDate).toLocaleDateString()}
              </p>
              <div className="mt-2 flex items-center">
                <Sparkles className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="text-xs text-foreground/60">
                  Booking ID: {booking.id.slice(0, 8)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex border-l border-darkColor">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-accent hover:text-accent/80 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    ),
    {
      duration: 6000,
      position: "top-right",
    }
  );
};

const BookingHistory: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) fetchBookings();
  }, [isAuthenticated, user]);

  useEffect(() => filterBookings(), [bookings, searchTerm, statusFilter]);

  const fetchBookings = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await getBookingHistory();
      setBookings(data.history || []);

      const newConfirmedBooking = data.history.find(
        (b: Booking) =>
          b.status === "confirmed" &&
          new Date(b.createdAt).getTime() > Date.now() - 60000
      );

      if (newConfirmedBooking) {
        setTimeout(() => {
          showConfirmationToast(newConfirmedBooking);
        }, 1000);
      }
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = (): void => {
    let filtered = bookings;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          (b.fleet.brand?.toLowerCase() || "").includes(term) ||
          (b.fleet.model?.toLowerCase() || "").includes(term) ||
          (b.pickupLocation?.toLowerCase() || "").includes(term) ||
          (b.dropoffLocation?.toLowerCase() || "").includes(term)
      );
    }
    if (statusFilter !== "all")
      filtered = filtered.filter((b) => b.status === statusFilter);
    setFilteredBookings(filtered);
  };

  const handleCancelBooking = (id: string) =>
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
    );

  if (authLoading || loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <button
        onClick={() => router.push("/home")}
        className="flex items-center gap-2 text-accent hover:underline mb-6"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Home
      </button>

      <div className="flex justify-between items-center mb-8 flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Booking History
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            You have {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="bg-whiteColor dark:bg-darkColor p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-darkColor bg-whiteColor dark:bg-darkColor text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <ButtonOne onClick={() => setShowFilters(!showFilters)}>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter{" "}
              {showFilters ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </ButtonOne>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-darkColor">
            <p className="text-sm font-medium mb-2 text-foreground">Status</p>
            <div className="flex flex-wrap gap-2">
              {["all", "pending", "confirmed", "completed", "cancelled"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      statusFilter === status
                        ? "bg-accent text-white"
                        : "bg-whiteColor dark:bg-darkColor text-foreground hover:brightness-95"
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
          <div className="text-center py-12 bg-whiteColor dark:bg-darkColor rounded-lg">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No bookings found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const BookingHistoryPage: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialMode = savedTheme ? savedTheme === "dark" : systemDark;
    if (initialMode) document.documentElement.classList.add("dark");
  }, []);

  if (authLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-background dark:bg-background text-foreground py-8">
      <BookingHistory />
    </div>
  );
};

export default BookingHistoryPage;
