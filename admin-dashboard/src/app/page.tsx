"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
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

  const [loadingStats, setLoadingStats] = useState<boolean>(true);
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  //  redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  // fetch dashboard stats only if authenticated
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);

        const endpoints = [
          `${process.env.NEXT_PUBLIC_BASE_URL}kirub-rental/admin/stats/getFleetCount`,
          `${process.env.NEXT_PUBLIC_BASE_URL}kirub-rental/admin/stats/getBookingsCount`,
          `${process.env.NEXT_PUBLIC_BASE_URL}kirub-rental/admin/stats/getUsersCount`,
          `${process.env.NEXT_PUBLIC_BASE_URL}kirub-rental/admin/stats/getTotalRevenue`,
        ];

        const responses = await Promise.all(
          endpoints.map(endpoint =>
            axios
              .get<ApiResponse<number>>(endpoint, { withCredentials: true })
              .then(res => res.data.data || 0)
              .catch(() => 0)
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
        setLoadingStats(false);
      }
    };

    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Checking authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // show stats loading
  if (loadingStats) {
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
          <h1 className="text-2xl font-bold mb-6">
            Welcome back, {user?.fullName || "Admin"} 👋
          </h1>
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
