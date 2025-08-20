"use client";

import { useEffect, useState } from 'react';
import CarCard from '../../../components/CarCard';
import axios from 'axios';

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

interface CarWithAvailability extends Car {
  available: boolean;
}

export default function FleetPage() {
  const [cars, setCars] = useState<CarWithAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        // 1. Fetch all cars
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/fleets/all`);
        const fleets: Car[] = res.data.data;

        // 2. Fetch availability for each car in parallel
        const fleetsWithAvailability = await Promise.all(
          fleets.map(async (car: Car) => {
            try {
              const availabilityRes = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/fleets/isAvailable/${car.id}`
              );
              return {
                ...car,
                available: availabilityRes.data.available, 
              };
            } catch (error) {
              console.error(`Error fetching availability for car ${car.id}:`, error);
              return {
                ...car,
                available: false,
              };
            }
          })
        );

        setCars(fleetsWithAvailability);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  const visibleCars = showAll ? cars : cars.slice(0, 8);

  return (
    <div className="bg-background dark:bg-background text-foreground dark:text-foreground px-12 py-12">
      <div className="max-w-screen-xl mx-auto">
        {/* Heading + See More */}
        <div className="flex justify-between items-center mb-6">
          <h2
            style={{ fontFamily: 'Orbitron, sans-serif' }}
            className="font-orbitron text-2xl font-extrabold tracking-tight md:text-3xl xl:text-4xl"
          >
            Rental <span className="text-red-500">Fleets</span>
          </h2>
          {cars.length > 8 && (
            <button
              className="text-lg font-bold text-foreground hover:underline"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'See Less' : 'See More'}
            </button>
          )}
        </div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visibleCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
}