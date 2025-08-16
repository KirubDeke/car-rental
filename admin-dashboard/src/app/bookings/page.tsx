"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiEye, FiTrash2, FiCalendar, FiUser, FiTruck } from "react-icons/fi";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";

interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  photo?: string;
}

interface Fleet {
  id: number;
  brand: string;
  model: string;
  year: number;
  plateNumber: string;
  type: string;
  pricePerDay: number | string;
  image: string;
}

interface Booking {
  id: number;
  startDate: string;
  endDate: string;
  totalPrice: number | string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
  user: User;
  fleet: Fleet;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const FleetImage = ({ fleet }: { fleet: Fleet }) => {
  const [imageError, setImageError] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");
  const imagePath = fleet.image?.replace(/^\//, "");
  const imageUrl = imagePath ? `${baseUrl}/uploads/cars/${imagePath}` : null;

  if (imageError || !imageUrl) {
    return (
      <div className="h-48 w-full bg-gray-100 rounded-lg flex flex-col items-center justify-center">
        <FiTruck className="w-16 h-16 text-gray-400" />
        <p className="text-gray-500 mt-2">No image available</p>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={`${fleet.brand} ${fleet.model}`}
      className="h-48 w-full object-contain rounded-lg bg-gray-100"
      onError={() => setImageError(true)}
    />
  );
};

export default function BookingsDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedFleet, setSelectedFleet] = useState<Fleet | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showFleetModal, setShowFleetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}kirub-rental/fleets/getBookingsInfo`,
          { withCredentials: true }
        );

        if (response.data.status === "success") {
          setBookings(response.data.data || []);
        } else {
          toast.error(response.data.message || "Failed to fetch bookings");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, authLoading, router]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}kirub-rental/fleets/getBookingsInfo`,
        { withCredentials: true }
      );
      if (response.data.status === "success") {
        setBookings(response.data.data || []);
      } else {
        toast.error(response.data.message || "Failed to fetch bookings");
      }
    } catch (error) {
      toast.error("Failed to fetch bookings");
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setBookingToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bookingToDelete) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}kirub-rental/fleets/deleteBooking/${bookingToDelete}`,
        { withCredentials: true }
      );
      toast.success("Booking deleted successfully");
      fetchBookings();
    } catch (error) {
      toast.error("Failed to delete booking");
      console.error("Error deleting booking:", error);
    } finally {
      setShowDeleteModal(false);
      setBookingToDelete(null);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatPrice = (price: number | string) => {
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("et-ET", {
      style: "currency",
      currency: "ETB",
    }).format(numericPrice);
  };

  const filteredBookings = bookings.filter((booking) => {
    const userName = booking.user?.fullName || "";
    const userEmail = booking.user?.email || "";
    const plateNumber = booking.fleet?.plateNumber || "";
    const bookingId = booking.id?.toString() || "";
    const fleetBrand = booking.fleet?.brand || "";
    const fleetModel = booking.fleet?.model || "";

    const matchesSearch =
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookingId.includes(searchTerm) ||
      fleetBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fleetModel.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-red-500 p-4">
              <h2 className="text-xl font-bold text-white">
                Bookings Management
              </h2>
            </div>

            <div className="p-6">
              {/* Filters Section */}
              <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiEye className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name, email, plate or ID..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg">
                    No bookings found matching your criteria
                  </div>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Booking ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <FiCalendar className="inline mr-1" />
                            Dates
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <FiUser className="inline mr-1" />
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <FiTruck className="inline mr-1" />
                            Vehicle
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredBookings.map((booking) => (
                          <tr key={booking.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              #{booking.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {formatDate(booking.startDate)}
                              </div>
                              <div className="text-sm text-gray-500">
                                to {formatDate(booking.endDate)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {booking.user?.photo && (
                                  <img
                                    src={booking.user.photo}
                                    alt={booking.user?.fullName || "User"}
                                    className="h-8 w-8 rounded-full mr-2 object-cover"
                                  />
                                )}
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {booking.user?.fullName || "N/A"}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {booking.user?.email || "N/A"}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedUser(booking.user || null);
                                  setShowUserModal(true);
                                }}
                                className="mt-1 text-xs text-blue-500 hover:text-blue-700 flex items-center"
                              >
                                <FiEye className="mr-1" /> View Details
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {booking.fleet?.brand || "N/A"}{" "}
                                {booking.fleet?.model || ""}
                              </div>
                              <div className="text-sm text-gray-500">
                                {booking.fleet?.plateNumber || "N/A"}
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedFleet(booking.fleet || null);
                                  setShowFleetModal(true);
                                }}
                                className="mt-1 text-xs text-blue-500 hover:text-blue-700 flex items-center"
                              >
                                <FiEye className="mr-1" /> View Details
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {booking.totalPrice
                                ? formatPrice(booking.totalPrice)
                                : "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                                  statusColors[booking.status] ||
                                  "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {booking.status || "N/A"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex space-x-3 justify-end">
                                <button
                                  onClick={() => handleDeleteClick(booking.id)}
                                  className="text-red-600 hover:text-red-900 transition-colors"
                                  title="Delete Booking"
                                >
                                  <FiTrash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* User Details Modal */}
                  <Modal
                    isOpen={showUserModal}
                    onClose={() => setShowUserModal(false)}
                    title="User Details"
                  >
                    {selectedUser && (
                      <div className="space-y-4">
                        {selectedUser.photo && (
                          <div className="flex justify-center">
                            <img
                              src={selectedUser.photo}
                              alt={selectedUser.fullName || "User"}
                              className="h-24 w-24 rounded-full object-cover"
                            />
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                          <DetailItem
                            label="Name"
                            value={selectedUser.fullName || "N/A"}
                          />
                          <DetailItem
                            label="Email"
                            value={selectedUser.email || "N/A"}
                          />
                          <DetailItem
                            label="Phone"
                            value={selectedUser.phoneNumber || "N/A"}
                          />
                          <DetailItem
                            label="User ID"
                            value={selectedUser.id?.toString() || "N/A"}
                          />
                        </div>
                      </div>
                    )}
                  </Modal>

                  {/* Fleet Details Modal */}
                  <Modal
                    isOpen={showFleetModal}
                    onClose={() => setShowFleetModal(false)}
                    title="Vehicle Details"
                  >
                    {selectedFleet && (
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <FleetImage fleet={selectedFleet} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <DetailItem
                            label="Brand/Model"
                            value={`${selectedFleet.brand || "N/A"} ${
                              selectedFleet.model || ""
                            }`}
                          />
                          <DetailItem
                            label="Year"
                            value={selectedFleet.year?.toString() || "N/A"}
                          />
                          <DetailItem
                            label="Plate Number"
                            value={selectedFleet.plateNumber || "N/A"}
                          />
                          <DetailItem
                            label="Type"
                            value={selectedFleet.type || "N/A"}
                          />
                          <DetailItem
                            label="Price Per Day"
                            value={
                              selectedFleet.pricePerDay
                                ? formatPrice(selectedFleet.pricePerDay)
                                : "N/A"
                            }
                          />
                          <DetailItem
                            label="Vehicle ID"
                            value={selectedFleet.id?.toString() || "N/A"}
                          />
                        </div>
                      </div>
                    )}
                  </Modal>

                  {/* Delete Confirmation Modal */}
                  <Modal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    title="Delete Booking"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <FiTrash2 className="w-8 h-8 text-red-600" />
                      </div>
                      <p className="text-gray-600 text-center mb-6">
                        Are you sure you want to delete this booking? This
                        action cannot be undone.
                      </p>
                      <div className="flex space-x-4 w-full">
                        <button
                          onClick={() => setShowDeleteModal(false)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleDeleteConfirm}
                          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </Modal>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Reusable Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-11/12 max-w-2xl p-6 relative">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <div>{children}</div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// Reusable Detail Item Component
const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-sm text-gray-500">{label}</div>
    <div className="text-sm font-medium text-gray-900">{value}</div>
  </div>
);
