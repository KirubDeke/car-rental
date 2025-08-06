"use client";

import { useAuth } from "../context/AuthContext";
import NavbarPrivate from "./NavbarPrivate";
import NavbarPublic from "./NavbarPublic";

export default function NavSwitcher() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; 

  return isAuthenticated ? <NavbarPrivate /> : <NavbarPublic />;
}