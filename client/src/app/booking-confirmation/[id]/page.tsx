'use client';

import { useEffect, useState, MouseEvent } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import {
  ArrowLeft, CheckCircle2, XCircle, CalendarDays, MapPin,
  Car, Fuel, Cog, Users, Edit2, Check, X,
  CreditCard, Banknote, ChevronRight, Smartphone, DollarSign, Moon, Sun
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ButtonOne from '../../../../components/ui/ButtonOne';

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
  const [actualBookingId, setActualBookingId] = useState<string | null>(null);
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
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const fetchBookingId = async (fleetId: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/fleets/bookingId/${fleetId}`,
        { withCredentials: true }
      );
      if (response.data.status === "success") {
        setActualBookingId(response.data.data.bookingId.toString());
      }
    } catch (error) {
      console.error("Error fetching booking ID:", error);
      toast.error("Failed to get booking reference");
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profileRes = await axios.get(
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
        const res = await axios.get(
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
      fetchBookingId(id);
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
    if (!selectedPayment || !booking || !actualBookingId) {
      toast.error("Please complete booking confirmation first");
      return;
    }
    try {
      toast.loading('Initializing payment...');
      const payload = {
        amount: booking.totalPrice,
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/chappa/initialize/${actualBookingId}`,
        payload,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      toast.dismiss();
      if (!response.data.checkout_url) {
        throw new Error('No checkout URL received');
      }
      window.location.href = response.data.checkout_url;
    } catch (err) {
      toast.dismiss();
      const error = err as AxiosError | Error;
      toast.error(error.message || 'Payment initialization failed');
      console.error('Payment error:', error);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'ETB',
      maximumFractionDigits: 0,
    });
  };

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md p-6 rounded-xl shadow-md bg-white dark:bg-gray-800">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Booking Error</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <ButtonOne
            onClick={() => router.back()}
            className="flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </ButtonOne>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20">
                <XCircle className="h-10 w-10 text-red-500" />
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
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors"
              >
                Go Back
              </button>
              <ButtonOne
                onClick={confirmCancelBooking}
                // variant="destructive"
                className="flex items-center gap-2"
              >
                <XCircle className="h-5 w-5" />
                Confirm Cancel
              </ButtonOne>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <ButtonOne
          onClick={() => router.back()}
          // variant="ghost"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </ButtonOne>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
            booking.status === 'confirmed' 
              ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' 
              : booking.status === 'cancelled' 
                ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300' 
                : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
          }`}>
            {booking.status === 'confirmed' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Booking Confirmation</h1>
              <p className="text-white/90 flex items-center gap-2 mt-2">
                <CalendarDays className="w-5 h-5" />
                {new Date(booking.pickupDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} - {new Date(booking.returnDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="p-3 md:p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <p className="text-white/80 text-sm">Booking Reference</p>
              <p className="font-mono font-bold text-lg md:text-xl">#{actualBookingId || 'Pending'}</p>
            </div>
          </div>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Car className="w-6 h-6 text-red-500" />
                Car Details
              </h2>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="relative h-64 w-full overflow-hidden rounded-lg mb-6 bg-gray-100 dark:bg-gray-700">
                <img
                  src={
                    booking.Fleet?.image
                      ? `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/cars/${booking.Fleet.image}`
                      : '/placeholder-car.png'
                  }
                  alt={`${booking.Fleet?.brand} ${booking.Fleet?.model}`}
                  className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {booking.Fleet?.brand} {booking.Fleet?.model} <span className="text-red-500">({booking.Fleet?.year})</span>
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <Feature 
                    icon={<Car className="w-5 h-5 text-red-500" />}
                    label="Type"
                    value={booking.Fleet?.type}
                  />
                  <Feature 
                    icon={<Fuel className="w-5 h-5 text-red-500" />}
                    label="Fuel"
                    value={booking.Fleet?.fuelType}
                  />
                  <Feature 
                    icon={<Users className="w-5 h-5 text-red-500" />}
                    label="Seats"
                    value={booking.Fleet?.seats.toString()}
                  />
                  <Feature 
                    icon={<Cog className="w-5 h-5 text-red-500" />}
                    label="Transmission"
                    value={booking.Fleet?.transmission}
                  />
                </div>

                <div className="bg-red-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-white">Daily Rate</span>
                    <span className="font-bold text-red-500 dark:text-red-400">
                      {formatPrice(booking.Fleet?.pricePerDay)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <CalendarDays className="w-6 h-6 text-red-500" />
                Booking Details
              </h2>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-6">
              <div className="space-y-4">
                <Feature 
                  icon={<CalendarDays className="w-5 h-5 text-red-500" />}
                  label="Pickup Date"
                  value={new Date(booking.pickupDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                />
                <Feature 
                  icon={<CalendarDays className="w-5 h-5 text-red-500" />}
                  label="Return Date"
                  value={new Date(booking.returnDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                />
                <Feature 
                  icon={<CalendarDays className="w-5 h-5 text-red-500" />}
                  label="Total Days"
                  value={booking.totalDate.toString()}
                />
                <Feature 
                  icon={<MapPin className="w-5 h-5 text-red-500" />}
                  label="Pickup Location"
                  value={booking.pickupLocation}
                />
              </div>

              <div className="bg-red-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-white">Total Price</span>
                  <span className="font-bold text-2xl text-red-500 dark:text-red-400">
                    {formatPrice(booking.totalPrice)}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-red-500" />
                    User Information
                  </h3>
                  <ButtonOne
                    onClick={toggleUserInfoEdit}
                    // variant="ghost"
                    // size="sm"
                    className="flex items-center gap-2"
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
                  </ButtonOne>
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
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleUserInfoChange}
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={editData.phoneNumber}
                        onChange={handleUserInfoChange}
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <ButtonOne
                        onClick={saveUserInfo}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Check className="w-5 h-5" />
                        Save Changes
                      </ButtonOne>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Feature 
                      label="Name"
                      value={booking.User?.fullName}
                    />
                    <Feature 
                      label="Email"
                      value={booking.User?.email}
                    />
                    <Feature 
                      label="Phone"
                      value={booking.User?.phoneNumber}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {booking?.status === 'pending' && (
              <ButtonOne
                onClick={handleConfirmBooking}
                disabled={isConfirming}
                className="w-full flex items-center justify-center gap-3"
              >
                {isConfirming ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CheckCircle2 className="w-6 h-6" />
                    Confirm Booking
                  </>
                )}
              </ButtonOne>
            )}

            {booking?.status === 'confirmed' && (
              <ButtonOne
                onClick={handleCancelBooking}
                disabled={isCanceling}
                // variant="destructive"
                className="w-full flex items-center justify-center gap-3"
              >
                {isCanceling ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <XCircle className="w-6 h-6" />
                    Cancel Booking
                  </>
                )}
              </ButtonOne>
            )}
          </div>
        </div>

        {booking.status === 'confirmed' && (
          <div className="bg-gray-50 dark:bg-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-blue-500" />
              Complete Your Payment
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => handlePaymentSelection('chapa')}
                className={`bg-white dark:bg-gray-800 p-4 rounded-lg flex items-center justify-between
                  ${selectedPayment === 'chapa' ? 'ring-2 ring-blue-500' : 'hover:bg-gray-100 dark:hover:bg-gray-600'}`}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-purple-900/20 p-3 rounded-full">
                    <CreditCard className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900 dark:text-white">Chapa</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Credit/Debit Card, Mobile Money
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            {selectedPayment && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-gray-600 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Proceed with {selectedPayment.replace('_', ' ')} payment
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-200 mb-4">
                  You'll be redirected to complete your payment securely
                </p>
                <ButtonOne
                  onClick={handlePayment}
                  disabled={!actualBookingId}
                  className="w-full"
                >
                  {actualBookingId ? `Pay ${formatPrice(booking.totalPrice)} Now` : 'Preparing payment...'}
                </ButtonOne>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Feature({
  icon,
  label,
  value,
  valueClass = ''
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg transition-colors
      bg-white dark:bg-gray-800
      hover:bg-red-50 dark:hover:bg-gray-700`}
    >
      {icon && <div className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0">{icon}</div>}
      <div className="flex-1">
        <p className="text-sm text-gray-500 dark:text-gray-300">{label}</p>
        <p className={`font-medium text-gray-900 dark:text-white ${valueClass}`}>
          {value || 'N/A'}
        </p>
      </div>
    </div>
  );
}