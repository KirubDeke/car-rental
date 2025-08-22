"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";
import {
  Moon,
  Sun,
  User,
  Mail,
  Phone,
  Camera,
  Lock,
  ArrowLeft,
  Upload,
} from "lucide-react";
import { toast } from "react-hot-toast";
import ButtonOne from "../../../../components/ui/ButtonOne";
import ButtonTwo from "../../../../components/ui/ButtonTwo";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  photo?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialMode = savedTheme ? savedTheme === "dark" : systemDark;
    setDarkMode(initialMode);
    if (initialMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/users/fetchProfile/${authUser?.id}`,
          { withCredentials: true }
        );
        setProfile(response.data);
        setFormData({
          fullName: response.data.fullName || "",
          email: response.data.email || "",
          phoneNumber: response.data.phoneNumber || "",
          password: "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (authUser?.id) {
      fetchProfile();
    }
  }, [authUser?.id]);

  // Handle image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processImageFile(file);
    }
  };

  // Process image file
  const processImageFile = (file: File) => {
    if (!file.type.match("image.*")) {
      toast.error("Please select an image file");
      return;
    }

    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // Trigger file input click
  const handleChangePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      if (formData.password)
        formDataToSend.append("password", formData.password);
      if (profileImage) formDataToSend.append("photo", profileImage);

      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/users/updateProfile/${authUser?.id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      toast.success("Profile updated successfully");
      setEditMode(false);
      // Refresh profile data
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/kirub-rental/users/fetchProfile/${authUser?.id}`,
        { withCredentials: true }
      );
      setProfile(response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <ButtonTwo
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </ButtonTwo>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
            <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center">
                <div
                  ref={dropAreaRef}
                  className={`relative w-40 h-40 rounded-full overflow-hidden border-4 ${
                    isDragging
                      ? "border-red-500 border-dashed"
                      : "border-white dark:border-gray-800"
                  } shadow-lg mb-4`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : profile?.photo ? (
                    <img
                      src={
                        profile.photo.startsWith("http")
                          ? profile.photo
                          : `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/users/${profile.photo}`
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        (e.currentTarget.src = "/car-placeholder.jpg")
                      }
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <User className="w-20 h-20 text-gray-400" />
                    </div>
                  )}

                  {isDragging && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-white text-center p-4">
                        <Upload className="w-8 h-8 mx-auto mb-2" />
                        <p>Drop image here</p>
                      </div>
                    </div>
                  )}
                </div>
                {editMode && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                    />
                    <ButtonOne
                      onClick={handleChangePhotoClick}
                      className="flex items-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      Change Photo
                    </ButtonOne>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      or drag and drop an image
                    </p>
                  </>
                )}
              </div>

              {/* Profile Info Section */}
              <div className="flex-1">
                {editMode ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white dark:text-white mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-300 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                        Phone Number
                      </label>
                      <div className="flex items-center">
                        <span className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-l-lg text-gray-900 dark:text-white">
                          +251
                        </span>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-r-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-white"
                        placeholder="Leave blank to keep current"
                      />
                    </div>

                    {formData.password && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-white"
                        />
                      </div>
                    )}

                    <div className="flex gap-4 pt-4">
                      <ButtonOne
                        type="submit"
                        disabled={loading}
                        className="flex-1"
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </ButtonOne>
                      <ButtonTwo
                        type="button"
                        onClick={() => {
                          setEditMode(false);
                          setPreviewImage("");
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </ButtonTwo>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {profile?.fullName}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        {profile?.email}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Phone className="w-5 h-5 text-red-500" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Phone
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {profile?.phoneNumber || "Not provided"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Mail className="w-5 h-5 text-red-500" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Email
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {profile?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <ButtonOne
                        onClick={() => setEditMode(true)}
                        className="flex-1"
                      >
                        Edit Profile
                      </ButtonOne>
                      <ButtonTwo
                        onClick={() => handleLogout()}
                        className="flex-1"
                      >
                        Sign Out
                      </ButtonTwo>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
