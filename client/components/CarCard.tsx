"use client";

import React from 'react';
import { Fuel, Users, Settings, CheckCircle, XCircle } from 'lucide-react';

interface Car {
  type: string;
  pricePerDay: string;
  fuelType: string;
  seats: number;
  transmission: string;
  availability: boolean;
  image: string;
}

const CarCard: React.FC<{ car: Car }> = ({ car }) => {
  const price = parseInt(car.pricePerDay).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all">
      {/* Image with badge */}
      <div className="relative h-44 bg-gray-50">
        <img
          src={car.image || '/car-placeholder.jpg'}
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
        <div className="flex items-center gap-x-3 text-xs text-gray-600">
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
              {car.availability ? (
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
          <button
            className={`px-3 py-1.5 text-sm rounded-md ${
              car.availability
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-100 text-gray-400'
            }`}
            disabled={!car.availability}
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;