'use client';

import { useEffect, useState, MouseEvent } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import {
  ArrowLeft, CheckCircle2, XCircle, CalendarDays, MapPin,
  Car, Fuel, Cog, Users, Edit2, Check, X,
  CreditCard, Banknote, ChevronRight, Smartphone, DollarSign
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Fleet {
  id: number;
  brand: string;
  model: string;
  year: number;
  type: string;
  plateNumber: string;
  pricePerDay: number;
  fuelType: string;
  seats: number;
  transmission: string;
  image: string;
}

interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
}

interface Booking {
  id: string;
  pickupDate: string;
  returnDate: string;
  totalDate: number;
  totalPrice: number;
  pickupLocation: string;
  User: User;
  Fleet: Fleet;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface EditData {
  fullName: string;
  phoneNumber: string;
  email: string;
}

type PaymentMethod = 'chapa' | 'mobile_banking' | 'cash' | 'bank_transfer' | 'paypal' | '';

interface ApiResponse<T> {
  status: string;
  data: T;
}

interface ProfileResponse {
  status: string;
  message: string;
  data: User;
}

export default function BookingConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const pickupLocation = searchParams.get('pickupLocation') || '';
  const totalDays = parseInt(searchParams.get('totalDays') || '0', 10);
  const totalPrice = parseFloat(searchParams.get('totalPrice') || '0');

  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string>('');
  const [isEditingUserInfo, setIsEditingUserInfo] = useState<boolean>(false);
  const [editData, setEditData] = useState<EditData>({
    fullName: '',
    phoneNumber: '',
    email: ''
  });
  const [isCanceling, setIsCanceling] = useState<boolean>(false);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('');
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profileRes = await axios.get<ProfileResponse>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/users/profile`,
          { withCredentials: true }
        );

        if (profileRes.data.status !== 'success') {
          throw new Error("Failed to fetch user profile");
        }

        const userData = profileRes.data.data;
        setEditData({
          fullName: userData.fullName || '',
          phoneNumber: userData.phoneNumber || '',
          email: userData.email || ''
        });

        if (!userData.fullName || !userData.phoneNumber || !userData.email) {
          setIsEditingUserInfo(true);
        }
      } catch (err) {
        const error = err as Error;
        console.error('Failed to fetch user profile:', error);
        setError('Failed to load user information. Please fill in your details.');
        setIsEditingUserInfo(true);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        if (!id) {
          throw new Error('Booking ID is missing');
        }

        const res = await axios.get<ApiResponse<any>>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/fleets/car/${id}`,
          { withCredentials: true }
        );

        const apiData = res.data.data;

        const fleetData: Fleet = {
          id: apiData.id,
          brand: apiData.brand,
          model: apiData.model,
          year: apiData.year,
          type: apiData.type,
          plateNumber: apiData.plateNumber,
          pricePerDay: parseFloat(apiData.pricePerDay),
          fuelType: apiData.fuelType,
          seats: apiData.seats,
          transmission: apiData.transmission,
          image: apiData.image
        };

        const combinedData: Booking = {
          id: id.toString(),
          pickupDate: startDate,
          returnDate: endDate,
          totalDate: totalDays,
          totalPrice: totalPrice,
          pickupLocation: pickupLocation,
          status: 'pending',
          User: {
            id: '',
            fullName: editData.fullName,
            phoneNumber: editData.phoneNumber,
            email: editData.email
          },
          Fleet: fleetData
        };

        setBooking(combinedData);
      } catch (err) {
        const error = err as AxiosError | Error;
        setError(error.message || 'Failed to fetch booking information');
        console.error('Fetch booking error:', error);
      }
    };

    fetchBooking();
  }, [id, startDate, endDate, totalDays, totalPrice, pickupLocation, editData]);

  const toggleUserInfoEdit = (): void => {
    setIsEditingUserInfo(!isEditingUserInfo);
  };

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const saveUserInfo = (): void => {
    if (!booking) return;

    const updatedBooking: Booking = {
      ...booking,
      User: {
        ...booking.User,
        fullName: editData.fullName,
        phoneNumber: editData.phoneNumber,
        email: editData.email
      }
    };

    setBooking(updatedBooking);
    setIsEditingUserInfo(false);
  };

  const handleConfirmBooking = async (): Promise<void> => {
    setIsConfirming(true);
    try {
      if (!id || !booking) {
        throw new Error('Missing booking data');
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/fleets/book-fleet/${id}`,
        {
          pickupDate: booking.pickupDate || startDate,
          returnDate: booking.returnDate || endDate,
          pickupLocation: booking.pickupLocation || pickupLocation,
          totalPrice: booking.totalPrice || totalPrice,
          fullName: editData.fullName,
          email: editData.email,
          phoneNumber: editData.phoneNumber
        },
        { withCredentials: true }
      );

      setBooking(prev => prev ? { ...prev, status: 'confirmed' } : null);
      toast.success('Booking confirmed successfully!');
    } catch (err) {
      const error = err as AxiosError | Error;
      setError(error.message || 'Failed to confirm booking');
      console.error('Confirm booking error:', error);
      toast.error(error.message || 'Failed to confirm booking');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCancelBooking = async (): Promise<void> => {
    setShowCancelModal(true);
  };

  const confirmCancelBooking = async (): Promise<void> => {
    setShowCancelModal(false);

    if (!id) {
      setError('Missing booking ID');
      return;
    }

    setIsCanceling(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/fleets/cancel-booking/${id}`,
        { withCredentials: true }
      );

      setBooking(prev => prev ? { ...prev, status: 'cancelled' } : null);
      toast.success('Booking cancelled successfully');
      router.push('/home');
    } catch (err) {
      const error = err as AxiosError | Error;
      setError(error.message || 'Failed to cancel booking');
      console.error('Cancel booking error:', error);
      toast.error(error.message || 'Failed to cancel booking');
    } finally {
      setIsCanceling(false);
    }
  };

  const handlePaymentSelection = (method: PaymentMethod): void => {
    setSelectedPayment(method);
  };

  const handlePayment = async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    if (!selectedPayment || !booking) return;

    try {
      toast.loading('Processing payment...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Payment of ${booking.totalPrice.toLocaleString()} ETB via ${selectedPayment} successful!`);
      router.push(`/bookings/${booking.id}`);
    } catch (err) {
      toast.error('Payment failed. Please try again.');
      console.error('Payment error:', err);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-lg dark:bg-gray-800">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full dark:bg-red-900/20 mb-4">
            <XCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto shadow-md hover:shadow-lg"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background text-foreground dark:text-foreground py-12 px-4 sm:px-6 lg:px-8">
      {showCancelModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20">
                <XCircle className="h-10 w-10 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4">Cancel Booking</h3>
              <div className="mt-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Are you sure you want to cancel this booking? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
              >
                Go Back
              </button>
              <button
                onClick={confirmCancelBooking}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <XCircle className="h-5 w-5" />
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-red-500 dark:text-red-500 hover:text-red-600 dark:hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <div className="flex items-center gap-4">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
              booking.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
              }`}>
              {booking.status === 'confirmed' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-3xl font-bold">Booking Confirmation</h1>
                <p className="text-white flex items-center gap-2 mt-2">
                  <CalendarDays className="w-5 h-5" />
                  {new Date(booking.pickupDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} - {new Date(booking.returnDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="p-4 rounded-lg">
                <p className="text-white text-sm">Booking Reference</p>
                <p className="font-mono font-bold text-xl">#{booking.id}</p>
              </div>
            </div>
          </div>

          <div className="p-6 grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <Car className="w-6 h-6 text-red-500" />
                  Car Details
                </h2>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                <div className="relative h-64 w-full overflow-hidden rounded-lg mb-6">
                  <img
                    src={
                      booking.Fleet?.image
                        ? `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/cars/${booking.Fleet.image}`
                        : '/placeholder-car.png'
                    }
                    alt={`${booking.Fleet?.brand} ${booking.Fleet?.model}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {booking.Fleet?.brand} {booking.Fleet?.model} <span className="text-red-500">({booking.Fleet?.year})</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                          <Car className="w-5 h-5 text-red-500" />
                          Type
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">{booking.Fleet?.type}</span>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                          <Fuel className="w-5 h-5 text-red-500" />
                          Fuel
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">{booking.Fleet?.fuelType}</span>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                          <Users className="w-5 h-5 text-red-500" />
                          Seats
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">{booking.Fleet?.seats}</span>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                          <Cog className="w-5 h-5 text-red-500" />
                          Transmission
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">{booking.Fleet?.transmission}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Daily Rate</span>
                      <span className="font-bold text-red-500 dark:text-red-400">
                        {booking.Fleet?.pricePerDay.toLocaleString()} ETB
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <CalendarDays className="w-6 h-6 text-red-600" />
                  Booking Details
                </h2>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600 space-y-6">
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                        <CalendarDays className="w-5 h-5 text-red-500" />
                        Pickup Date
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(booking.pickupDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                        <CalendarDays className="w-5 h-5 text-red-500" />
                        Return Date
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(booking.returnDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                        <CalendarDays className="w-5 h-5 text-red-500" />
                        Total Days
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">{booking.totalDate}</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-red-500" />
                        Pickup Location
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">{booking.pickupLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Total Price</span>
                    <span className="font-bold text-2xl text-red-600 dark:text-red-400">
                      {booking.totalPrice.toLocaleString()} ETB
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-lg text-gray-800 dark:text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-red-500" />
                      User Information
                    </h3>
                    <button
                      onClick={toggleUserInfoEdit}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${isEditingUserInfo
                        ? 'text-foreground hover:bg-background dark:hover:bg-red-900/20'
                        : 'text-foreground hover:text-foreground dark:hover:bg-red-900/20'
                        }`}
                    >
                      {isEditingUserInfo ? (
                        <>
                          <X className="w-4 h-4" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </>
                      )}
                    </button>
                  </div>

                  {isEditingUserInfo ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          value={editData.fullName}
                          onChange={handleUserInfoChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={editData.email}
                          onChange={handleUserInfoChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={editData.phoneNumber}
                          onChange={handleUserInfoChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={saveUserInfo}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <Check className="w-5 h-5" />
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-300">Name</span>
                          <span className="font-medium text-gray-900 dark:text-white">{booking.User?.fullName}</span>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-300">Email</span>
                          <span className="font-medium text-gray-900 dark:text-white">{booking.User?.email}</span>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-300">Phone</span>
                          <span className="font-medium text-gray-900 dark:text-white">{booking.User?.phoneNumber}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-700">
            <div className="flex flex-col sm:flex-row gap-4">
              {booking?.status === 'pending' && (
                <button
                  onClick={handleConfirmBooking}
                  disabled={isConfirming}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-3 disabled:opacity-70 shadow-md hover:shadow-lg"
                >
                  {isConfirming ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <CheckCircle2 className="w-6 h-6" />
                      Confirm Booking
                    </>
                  )}
                </button>
              )}

              {booking?.status === 'confirmed' && (
                <button
                  onClick={handleCancelBooking}
                  disabled={isCanceling}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-3 disabled:opacity-70 shadow-md hover:shadow-lg"
                >
                  {isCanceling ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6" />
                      Cancel Booking
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {booking.status === 'confirmed' && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-blue-600" />
                Complete Your Payment
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => handlePaymentSelection('chapa')}
                  className={`bg-white dark:bg-gray-800 p-4 rounded-lg border transition-all flex items-center justify-between ${selectedPayment === 'chapa'
                    ? 'border-blue-500 dark:border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900/50'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-100 p-3 rounded-full"><CreditCard className="w-6 h-6 text-purple-600" /></div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900 dark:text-white">Chapa</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Secure online payment</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button
                  onClick={() => handlePaymentSelection('mobile_banking')}
                  className={`bg-white dark:bg-gray-800 p-4 rounded-lg border transition-all flex items-center justify-between ${selectedPayment === 'mobile_banking'
                    ? 'border-blue-500 dark:border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900/50'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full"><Smartphone className="w-6 h-6 text-blue-600" /></div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900 dark:text-white">Mobile Banking</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Pay with mobile wallet</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button
                  onClick={() => handlePaymentSelection('cash')}
                  className={`bg-white dark:bg-gray-800 p-4 rounded-lg border transition-all flex items-center justify-between ${selectedPayment === 'cash'
                    ? 'border-blue-500 dark:border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900/50'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full"><DollarSign className="w-6 h-6 text-green-600" /></div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900 dark:text-white">Cash</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Pay on pickup</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button
                  onClick={() => handlePaymentSelection('bank_transfer')}
                  className={`bg-white dark:bg-gray-800 p-4 rounded-lg border transition-all flex items-center justify-between ${selectedPayment === 'bank_transfer'
                    ? 'border-blue-500 dark:border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900/50'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-yellow-100 p-3 rounded-full"><Banknote className="w-6 h-6 text-yellow-600" /></div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900 dark:text-white">Bank Transfer</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Direct bank payment</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button
                  onClick={() => handlePaymentSelection('paypal')}
                  className={`bg-white dark:bg-gray-800 p-4 rounded-lg border transition-all flex items-center justify-between ${selectedPayment === 'paypal'
                    ? 'border-blue-500 dark:border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900/50'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 p-3 rounded-full"><CreditCard className="w-6 h-6 text-orange-600" /></div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900 dark:text-white">PayPal</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">International payments</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {selectedPayment && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <h3 className="font-medium text-gray-800 dark:text-white mb-2">Proceed with {selectedPayment.replace('_', ' ')} payment</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">You'll be redirected to complete your payment securely</p>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
                    onClick={handlePayment}
                  >
                    Pay {booking.totalPrice.toLocaleString()} ETB Now
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}