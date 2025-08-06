"use client";

import { useEffect, useState } from 'react';
import CarCard from '../../../components/CarCard';

export default function FleetPage() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch('http://localhost:8000/kirub-rental/fleets/all');
        const { data } = await res.json();
        setCars(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="bg-background dark:bg-background text-foreground dark:text-foreground px-12 py-12">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight mb-8">Available Vehicles</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
}