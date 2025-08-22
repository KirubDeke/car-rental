'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fuel, Users, Settings, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import ButtonOne from './ui/ButtonOne';

interface Car {
  id: number;
  type: string;
  pricePerDay: string;
  fuelType: string;
  seats: number;
  transmission: string;
  image: string;
}

const CarCard: React.FC<{ car: Car }> = ({ car }) => {
  const router = useRouter();
  const [availability, setAvailability] = useState<boolean>(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/fleets/isAvailable/${car.id}`
        );
        setAvailability(res.data.available ?? false);
      } catch (error) {
        console.error(`Error fetching availability for car ${car.id}:`, error);
        setAvailability(false);
      }
    };

    fetchAvailability();
  }, [car.id]);

  const price = parseInt(car.pricePerDay, 10).toLocaleString('en-US', {
    style: 'currency',
    currency: 'ETB',
    maximumFractionDigits: 0,
  });

  return (
    <div
      className="cursor-pointer w-full bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg shadow-sm hover:shadow-md transition-all"
      onClick={() => router.push(`/fleet/${car.id}`)}
    >
      {/* Image */}
      <div className="relative h-44 bg-gray-50">
        <img
          src={car.image}
          alt="Vehicle"
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = '/car-placeholder.jpg')}
        />
        <span className="absolute top-2 left-2 bg-black/90 text-white text-xs px-2 py-1 rounded">
          {car.type.toUpperCase()}
        </span>
      </div>

      {/* Details */}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-x-3 text-xs text-foreground dark:text-foreground">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {car.seats}
          </span>
          <span className="flex items-center gap-1">
            <Fuel className="w-3.5 h-3.5" />
            {car.fuelType}
          </span>
          <span className="flex items-center gap-1">
            <Settings className="w-3.5 h-3.5" />
            {car.transmission}
          </span>
        </div>

        <div className="flex justify-between items-center pt-1">
          <div>
            <p className="text-lg font-bold">{price}</p>
            <div className="flex items-center gap-1 text-xs">
              {availability ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-green-600">Available</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-red-600">Unavailable</span>
                </>
              )}
            </div>
          </div>

          {/* Button with Link */}
          <Link href={`/fleet/${car.id}`} passHref>
            <ButtonOne
              type="button"
              onClick={(e) => e.stopPropagation()} 
              className={`px-3 py-1.5 text-sm rounded-md ${availability
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              disabled={!availability}
            >
              Book Now
            </ButtonOne>

          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
