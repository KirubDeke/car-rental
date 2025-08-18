"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface User {
  photo: any;
  id: number;
  fullName: string;
  email: string;
  role: string;
}

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { fullName: string; email: string; phoneNumber: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // On mount, check if user is authenticated by calling /me
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/users/me`, {
          withCredentials: true,
        });
        if (res.data.authenticated) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/users/login`,
        { email, password },
        { withCredentials: true }
      );
      // After login, call /me to get user info from cookie
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/users/me`, {
        withCredentials: true,
      });
      setUser(res.data.user);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: { fullName: string; email: string; phoneNumber: string; password: string }) => {
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/users/signup`, data, {
        withCredentials: true,
      });
      // After signup, call /me to get user info from cookie
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/users/me`, {
        withCredentials: true,
      });
      setUser(res.data.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/users/logout`, {}, { withCredentials: true });
      toast.success("Log Out successfull")
      router.push("/home")
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
