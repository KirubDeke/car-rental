import axios from 'axios';
import { Car, Fuel, Cog, Users, CalendarDays, BadgeInfo, CheckCircle2, XCircle } from 'lucide-react';
import ButtonOne from '../../../../components/ui/ButtonOne';

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

export default async function CarDetailPage({ params }: { params: { id: string } }) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/fleets/car/${params.id}`
    );
    const car: Car = res.data.data;

    const price = parseInt(car.pricePerDay).toLocaleString('en-US', {
      style: 'currency',
      currency: 'ETB',
      maximumFractionDigits: 0
    });

    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Car image section - Updated for full visibility */}
          <div className="rounded-xl overflow-hidden group flex items-center justify-center p-4 min-h-[20rem]">
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/cars/${car.image}`}
                alt={`${car.brand} ${car.model}`}
                className="object-contain w-full h-full max-h-[28rem]"
              />
              {car.availability ? (
                <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Available
                </div>
              ) : (
                <div className="absolute top-4 right-4 bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  Unavailable
                </div>
              )}
            </div>
          </div>

          {/* Car details section (unchanged) */}
          <div className="space-y-6">
            {/* Title and basic info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground dark:text-foreground">
                {car.brand} {car.model} <span className="text-red-500">({car.year})</span>
              </h1>
              <p className="text-lg text-foreground dark:text-foreground mt-2">{car.type}</p>
            </div>

            {/* Price and booking CTA */}
            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-sm text-foreground dark:text-background">Daily rate</p>
                  <p className="text-2xl font-bold text-red-500">{price}</p>
                </div>
                <ButtonOne
                  className={`${car.availability 
                    ? '' 
                    : ''}`}
                  disabled={!car.availability}
                >
                  {car.availability ? 'Book Now' : 'Not Available'}
                </ButtonOne>
              </div>
            </div>

            {/* Description */}
            <div className="prose text-foreground dark:text-foreground">
              <p>{car.description}</p>
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                <Car className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Vehicle Type</p>
                  <p className="font-medium">{car.type}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                <Fuel className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Fuel Type</p>
                  <p className="font-medium">{car.fuelType}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                <Cog className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Transmission</p>
                  <p className="font-medium">{car.transmission}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                <Users className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Seating Capacity</p>
                  <p className="font-medium">{car.seats} people</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                <BadgeInfo className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Plate Number</p>
                  <p className="font-medium font-mono">{car.plateNumber}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                {car.availability ? (
                  <CheckCircle2 className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 mt-0.5 text-red-600 flex-shrink-0" />
                )}
                <div>
                  <p className="text-sm text-gray-500">Availability</p>
                  <p className={`font-medium ${car.availability ? 'text-green-600' : 'text-red-600'}`}>
                    {car.availability ? 'Available Now' : 'Currently Booked'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-md">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Car Not Found</h2>
          <p className="text-gray-500 mb-4">The car you're looking for doesn't exist or may have been removed.</p>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            onClick={() => window.location.href = '/'}
          >
            <Car className="w-4 h-4" />
            Browse Available Cars
          </button>
        </div>
      </div>
    );
  }
}