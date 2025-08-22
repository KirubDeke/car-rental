"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import {
  Car as CarIcon,
  Fuel,
  Cog,
  Users,
  BadgeInfo,
  CheckCircle2,
  XCircle,
  CalendarDays,
  MapPin,
  X,
  ArrowLeft,
} from "lucide-react";
import ButtonOne from "../../../../components/ui/ButtonOne";
import { useAuth } from "../../../../context/AuthContext";

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  type: string;
  plateNumber: string;
  pricePerDay: string;
  fuelType: string;
  seats: number;
  transmission: string;
  availability: boolean;
  image: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function CarDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [car, setCar] = useState<Car | null>(null);
  const [error, setError] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    pickupLocation: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const fetchCarAndAvailability = async () => {
      try {
        const carRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/fleets/car/${id}`
        );
        const carData = carRes.data.data;
        const today = new Date().toISOString().split("T")[0];
        const availRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/fleets/isAvailable/${id}?date=${today}`
        );
        carData.availability = availRes.data.available;
        setCar(carData);
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };
    if (id) fetchCarAndAvailability();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    try {
      if (!formData.startDate || !formData.endDate)
        throw new Error("Please fill all required fields");
      if (new Date(formData.endDate) <= new Date(formData.startDate))
        throw new Error("End date must be after start date");

      const availRes = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/fleets/isAvailable/${id}?date=${formData.startDate}`
      );
      if (!availRes.data.available)
        throw new Error(
          "This car is not available for the selected start date"
        );

      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const totalDays = Math.ceil(
        Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );
      const totalPrice = totalDays * parseInt(car?.pricePerDay || "0");

      const queryParams = new URLSearchParams({
        startDate: formData.startDate,
        endDate: formData.endDate,
        pickupLocation: formData.pickupLocation,
        totalDays: totalDays.toString(),
        totalPrice: totalPrice.toString(),
      }).toString();

      router.push(`/booking-confirmation/${id}?${queryParams}`);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error)
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md p-6 rounded-xl shadow-md bg-whiteColor dark:bg-darkColor">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Car Not Found
          </h2>
          <p className="text-sm text-foreground/70 mb-4">
            The car you&apos;re looking for doesn&apos;t exist or may have been
            removed.
          </p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            onClick={() => router.push("/")}
          >
            <CarIcon className="w-4 h-4" /> Browse Available Cars
          </button>
        </div>
      </div>
    );

  if (!car)
    return (
      <div className="text-center py-20 text-foreground">
        Loading car details...
      </div>
    );

  const price = parseInt(car.pricePerDay).toLocaleString("en-US", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-foreground">
      {/* Back button */}
      <button
        onClick={() => router.push("/home")}
        className="flex items-center gap-2 font-semibold mb-8 text-foreground transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back to cars
      </button>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-whiteColor dark:bg-darkColor rounded-xl shadow-xl max-w-md w-full relative">
            <button
              onClick={() => setShowBookingForm(false)}
              className="absolute top-4 right-4 text-foreground hover:text-red-500"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2 text-foreground">
                Book {car.brand} {car.model}
              </h2>
              <p className="text-red-500 font-medium mb-6">{price} per day</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                  <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-3 rounded-md text-sm">
                    {formError}
                  </div>
                )}

                <InputWithIcon
                  icon={<CalendarDays className="h-5 w-5 text-foreground" />}
                  label="Pickup Date"
                  name="startDate"
                  value={formData.startDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={handleInputChange}
                />
                <InputWithIcon
                  icon={<CalendarDays className="h-5 w-5 text-foreground" />}
                  label="Return Date"
                  name="endDate"
                  value={formData.endDate}
                  min={
                    formData.startDate || new Date().toISOString().split("T")[0]
                  }
                  onChange={handleInputChange}
                />
                <InputWithIcon
                  icon={<MapPin className="h-5 w-5 text-foreground" />}
                  label="Pickup Location"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  placeholder="e.g. Bole Airport"
                  onChange={handleInputChange}
                />

                <ButtonOne
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Processing..." : "Continue to Booking"}
                </ButtonOne>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Car Image & Details */}
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {/* Car Image */}
        <div className="rounded-xl overflow-hidden group flex items-center justify-center p-4 min-h-[20rem] bg-whiteColor dark:bg-darkColor relative">
          <img
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            className="object-contain w-full h-full max-h-[28rem]"
          />
          {car.availability ? (
            <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 dark:bg-green-900 dark:text-green-200">
              <CheckCircle2 className="w-4 h-4" /> Available
            </div>
          ) : (
            <div className="absolute top-4 right-4 bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 dark:bg-red-900 dark:text-red-200">
              <XCircle className="w-4 h-4" /> Unavailable
            </div>
          )}
        </div>

        {/* Car Details */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {car.brand} {car.model}{" "}
            <span className="text-red-500">({car.year})</span>
          </h1>
          <p className="text-lg text-foreground">{car.type}</p>

          <div className="bg-whiteColor dark:bg-darkColor rounded-xl p-5 flex justify-between items-center">
            <div>
              <p className="text-sm text-foreground">Daily rate</p>
              <p className="text-2xl font-bold text-red-500">{price}</p>
            </div>
            <ButtonOne
              onClick={() =>
                !user ? router.push("/signup") : setShowBookingForm(true)
              }
              disabled={!car.availability}
            >
              {car.availability ? "Book Now" : "Not Available"}
            </ButtonOne>
          </div>

          <div className="prose text-foreground dark:text-foreground/90">
            <p>{car.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Feature
              icon={<CarIcon className="w-5 h-5" />}
              label="Vehicle Type"
              value={car.type}
            />
            <Feature
              icon={<Fuel className="w-5 h-5" />}
              label="Fuel Type"
              value={car.fuelType}
            />
            <Feature
              icon={<Cog className="w-5 h-5" />}
              label="Transmission"
              value={car.transmission}
            />
            <Feature
              icon={<Users className="w-5 h-5" />}
              label="Seating Capacity"
              value={`${car.seats} people`}
            />
            <Feature
              icon={<BadgeInfo className="w-5 h-5" />}
              label="Plate Number"
              value={car.plateNumber}
            />
            <Feature
              icon={
                car.availability ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )
              }
              label="Availability"
              value={car.availability ? "Available Now" : "Currently Booked"}
              valueClass={car.availability ? "text-green-600" : "text-red-600"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Feature Component
function Feature({
  icon,
  label,
  value,
  valueClass = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-whiteColor dark:bg-darkColor hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
      <div className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-sm text-foreground/70">{label}</p>
        <p className={`font-medium ${valueClass}`}>{value}</p>
      </div>
    </div>
  );
}

// InputWithIcon Component
function InputWithIcon({
  icon,
  label,
  name,
  value,
  placeholder,
  min,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  min?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground/80 dark:text-foreground/90">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          type={name.includes("Date") ? "date" : "text"}
          name={name}
          value={value}
          placeholder={placeholder}
          min={min}
          onChange={onChange}
          className="
            pl-10 py-3 block w-full rounded-md
            border border-gray-300 dark:border-gray-600
            bg-whiteColor dark:bg-darkColor
            text-foreground
            placeholder-gray-400 dark:placeholder-gray-500
            shadow-sm
            focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
            transition-colors
          "
          required
        />
      </div>
    </div>
  );
}
