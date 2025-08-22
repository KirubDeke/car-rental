"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Calendar,
  MapPin,
  Car,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  ArrowLeft,
  AlertCircle,
  X,
  AlertTriangle,
} from "lucide-react";
import ButtonOne from "../../../../components/ui/ButtonOne";

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
  totalCost?: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  pickupLocation: string;
  createdAt: string;
  updatedAt: string;
  fleet: Fleet;
  payment: Payment;
}

export default function SingleBookingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchBooking = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/fleets/getBookingHistory/${id}`,
          { withCredentials: true }
        );
        setBooking(res.data.booking);
      } catch (error) {
        toast.error("Failed to fetch booking details");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const cancelBooking = async () => {
    if (!booking) return;
    setCancelling(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/fleets/cancel-booking/${booking.id}`,
        {},
        { withCredentials: true }
      );
      toast.success("Booking cancelled successfully");
      setBooking({ ...booking, status: "cancelled" });
      setShowCancelModal(false);
    } catch {
      toast.error("Failed to cancel booking");
    } finally {
      setCancelling(false);
    }
  };

  const parseDate = (dateStr: string) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d;
  };

  const rentalDays = () => {
    if (!booking) return 0;
    const start = parseDate(booking.startDate);
    const end = parseDate(booking.endDate);
    if (!start || !end) return 0;
    const diff = end.getTime() - start.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const totalCost = booking
    ? booking.totalCost ?? booking.fleet.pricePerDay * rentalDays()
    : 0;

  const formatDate = (dateString: string) => {
    const d = parseDate(dateString);
    if (!d) return "-";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusColors = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    confirmed:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    completed:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    cancelled:
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  const statusIcons = {
    pending: <Clock className="w-5 h-5" />,
    confirmed: <CheckCircle className="w-5 h-5" />,
    completed: <CheckCircle className="w-5 h-5" />,
    cancelled: <XCircle className="w-5 h-5" />,
  };

  const CancelConfirmationModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-whiteColor dark:bg-darkColor rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in-90 zoom-in-95">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Cancel Booking
            </h3>
          </div>
          <button
            onClick={() => setShowCancelModal(false)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-foreground">
            Are you sure you want to cancel this booking? This action cannot be
            undone.
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800 dark:text-red-300">
                <p className="font-medium">Important:</p>
                <p>• Cancellation may be subject to fees according to our policy</p>
                <p>• Refunds will be processed within 5-7 business days</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowCancelModal(false)}
              className="flex-1 px-4 py-2 border border-darkColor dark:border-whiteColor text-foreground rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Keep Booking
            </button>
            <button
              onClick={cancelBooking}
              disabled={cancelling}
              className="flex-1 px-4 py-2 bg-accent text-whiteColor rounded-lg hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {cancelling ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel Booking"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="min-h-screen bg-background dark:bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );

  if (!booking)
    return (
      <div className="min-h-screen bg-background dark:bg-background flex items-center justify-center">
        <div className="max-w-md w-full bg-whiteColor dark:bg-darkColor p-8 rounded-lg shadow-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Booking Not Found
          </h2>
          <p className="text-foreground mb-6">
            The booking you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have permission to view it.
          </p>
          <button
            onClick={() => router.push("/booking-history")}
            className="px-6 py-3 bg-accent text-whiteColor rounded-md hover:brightness-95 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Booking History
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-background dark:bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => router.push("/booking-history")}
          className="flex items-center gap-2 text-accent hover:brightness-95 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Booking History
        </button>

        <div className="bg-whiteColor dark:bg-darkColor rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-darkColor">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Booking Details
                </h1>
                <p className="text-foreground">ID: {booking.id}</p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
                  statusColors[booking.status]
                }`}
              >
                {statusIcons[booking.status]}
                {booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Fleet Info */}
          <div className="p-6 border-b border-darkColor">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-80 h-56 bg-darkColor rounded-lg overflow-hidden">
                <img
                  src={booking.fleet.image}
                  alt={booking.fleet.model}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground mb-2">
                  {booking.fleet.brand} {booking.fleet.model} (
                  {booking.fleet.year})
                </h2>
                <p className="text-foreground mb-4">
                  {booking.fleet.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-foreground">
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    {booking.fleet.type}
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    ETB {booking.fleet.pricePerDay}/day
                  </div>
                  <div className="flex items-center gap-2">
                    {booking.fleet.fuelType}
                  </div>
                  <div className="flex items-center gap-2">
                    {booking.fleet.transmission}
                  </div>
                  <div className="flex items-center gap-2">
                    {booking.fleet.seats} seats
                  </div>
                  <div className="flex items-center gap-2">
                    Plate: {booking.fleet.plateNumber}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Information */}
          <div className="p-6 border-b border-darkColor text-foreground">
            <h3 className="text-lg font-semibold mb-4">Booking Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Calendar className="w-6 h-6 text-accent mt-1" />
                <div>
                  <p className="text-sm font-medium">Rental Period</p>
                  <p>
                    {formatDate(booking.startDate)} -{" "}
                    {formatDate(booking.endDate)} ({rentalDays()}{" "}
                    {rentalDays() > 1 ? "days" : "day"})
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-accent mt-1" />
                <div>
                  <p className="text-sm font-medium">Pickup Location</p>
                  <p>{booking.pickupLocation}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="w-6 h-6 text-accent mt-1" />
                <div>
                  <p className="text-sm font-medium">Total Cost</p>
                  <p className="text-xl font-bold">ETB {totalCost.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          {booking.payment && (
            <div className="p-6 border-b border-darkColor">
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Payment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-foreground">
                <div>
                  <p className="text-sm font-medium">Payment Method</p>
                  <p>{booking.payment.method}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Amount</p>
                  <p>ETB {totalCost.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                      booking.payment.status === "success"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {booking.payment.status === "success" ? "Paid" : "Pending"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Transaction Reference</p>
                  <p>{booking.payment.tx_ref}</p>
                </div>
                {booking.payment.paidAt && (
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium">Paid At</p>
                    <p>{formatDateTime(booking.payment.paidAt)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Booking Timeline */}
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Booking Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5"></div>
                  <div className="w-0.5 h-16 bg-darkColor"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Booking Created
                  </p>
                  <p className="text-sm text-foreground">
                    {formatDateTime(booking.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                  <div className="w-0.5 h-16 bg-darkColor"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Pickup Date
                  </p>
                  <p className="text-sm text-foreground">
                    {formatDate(booking.startDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Return Date
                  </p>
                  <p className="text-sm text-foreground">
                    {formatDate(booking.endDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cancel Button */}
          {(booking.status === "confirmed" || booking.status === "pending") && (
            <div className="p-6 bg-darkColor">
              <div className="flex justify-end">
                <ButtonOne
                  onClick={() => setShowCancelModal(true)}
                  className="px-6 py-3 bg-accent text-whiteColor rounded-md hover:brightness-95 transition-colors flex items-center gap-2"
                >
                  Cancel Booking
                </ButtonOne>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCancelModal && <CancelConfirmationModal />}
    </div>
  );
}
