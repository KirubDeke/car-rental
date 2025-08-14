"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import StatsCard from "../../components/StatsCard";
import { FaTruck, FaUsers, FaDollarSign, FaCalendarAlt } from "react-icons/fa";

type ApiResponse<T> = {
  status: "success" | "fail" | "error";
  message: string;
  data: T;
};

type StatsData = {
  fleetCount: number;
  bookingCount: number;
  usersCount: number;
  totalRevenue: number;
};

export default function Dashboard() {
  const [stats, setStats] = useState<StatsData>({
    fleetCount: 0,
    bookingCount: 0,
    usersCount: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const endpoints = [
          `${process.env.NEXT_PUBLIC_BASE_URL}kirub-rental/admin/stats/getFleetCount`,
          `${process.env.NEXT_PUBLIC_BASE_URL}kirub-rental/admin/stats/getBookingsCount`,
          `${process.env.NEXT_PUBLIC_BASE_URL}kirub-rental/admin/stats/getUsersCount`,
          `${process.env.NEXT_PUBLIC_BASE_URL}kirub-rental/admin/stats/getTotalRevenue`,
        ];

        const responses = await Promise.all(
          endpoints.map(endpoint => 
            axios.get<ApiResponse<number>>(endpoint)
              .then(res => res.data.data || 0) 
              .catch(err => {
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                  return 0;
                }
                console.error("API error:", err.message);
                return 0;
              })
          )
        );
        setStats({
          fleetCount: responses[0],
          bookingCount: responses[1],
          usersCount: responses[2],
          totalRevenue: responses[3],
        });
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatsCard
              title="Total Cars"
              value={stats.fleetCount.toString()}
              icon={<FaTruck className="h-6 w-6 text-blue-600" />}
              trend=""
            />
            <StatsCard
              title="Active Bookings"
              value={stats.bookingCount.toString()}
              icon={<FaCalendarAlt className="h-6 w-6 text-green-600" />}
              trend=""
            />
            <StatsCard
              title="Total Users"
              value={stats.usersCount.toString()}
              icon={<FaUsers className="h-6 w-6 text-purple-600" />}
              trend=""
            />
            <StatsCard
              title="Revenue"
              value={`ETB ${stats.totalRevenue.toLocaleString()}`}
              icon={<FaDollarSign className="h-6 w-6 text-yellow-600" />}
              trend=""
            />
          </div>
        </main>
      </div>
    </div>
  );
}