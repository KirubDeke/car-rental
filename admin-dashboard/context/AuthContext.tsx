"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface User {
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
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}kirub-rental/users/me`, {
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
        `${process.env.NEXT_PUBLIC_BASE_URL}kirub-rental/users/login`,
        { email, password },
        { withCredentials: true }
      );
      // After login, call /me to get user info from cookie
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}kirub-rental/users/me`, {
        withCredentials: true,
      });
      const userData = res.data.user;

      if(userData.role === "admin"){
          setUser({
        id: userData.id,
        fullName: userData.fullName,
        email: userData.email,
        role: userData.role,
      });
         toast.success("Login Successful");
         router.push("/");
      }else{
        toast.error("Access Denied");
      }
    }catch(error){
        toast.error("Login Failed");
    } finally {
      setLoading(false);
    }
  };

 
  const logout = async () => {
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}kirub-rental/users/logout`, {}, { withCredentials: true });
      toast.success("Log Out successfull")
      router.push("/")
      setUser(null);
    }catch(error){
      toast.error("Log Out failed")
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
