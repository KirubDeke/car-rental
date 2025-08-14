"use client";

import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import Header from "../../../../components/Header";
import Sidebar from "../../../../components/Sidebar";

const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"];
const transmissionTypes = ["Automatic", "Manual"];
const seatOptions = [2, 4, 5, 7, 8];

export default function CarCreationForm() {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    plateNumber: "",
    type: "",
    pricePerDay: "",
    fuelType: fuelTypes[0],
    seats: seatOptions[2],
    transmission: transmissionTypes[0],
    description: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setImage(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Append image if exists
      if (image) {
        formDataToSend.append("image", image);
      }

      const response = await axios.post(
        "http://localhost:8000/kirub-rental/fleets/create",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Car created successfully!");
        // Reset form after successful submission
        setFormData({
          brand: "",
          model: "",
          year: "",
          plateNumber: "",
          type: "",
          pricePerDay: "",
          fuelType: fuelTypes[0],
          seats: seatOptions[2],
          transmission: transmissionTypes[0],
          description: "",
        });
        setImage(null);
      } else {
        toast.error(response.data.message || "Failed to create car");
      }
    } catch (error: any) {
      console.error("Error creating car:", error);
      toast.error(error.response?.data?.message || "Failed to create car. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-4 flex justify-center">
          <div className="w-full max-w-5xl">
            <div className="bg-white rounded-xl shadow-md overflow-hidden min-h-[600px]">
              <div className="bg-red-500 p-4">
                <h2 className="text-xl font-semibold text-white">Add New Fleet</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Column 1 */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Brand*</label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Model</label>
                      <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Year</label>
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        min="1900"
                        max={new Date().getFullYear()}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Plate Number*</label>
                      <input
                        type="text"
                        name="plateNumber"
                        value={formData.plateNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Type*</label>
                      <input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Price Per Day*</label>
                      <input
                        type="number"
                        name="pricePerDay"
                        value={formData.pricePerDay}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border rounded-md focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Column 3 */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
                      <select
                        name="fuelType"
                        value={formData.fuelType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        {fuelTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Transmission</label>
                      <select
                        name="transmission"
                        value={formData.transmission}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        {transmissionTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Seats</label>
                      <select
                        name="seats"
                        value={formData.seats}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        {seatOptions.map(seats => (
                          <option key={seats} value={seats}>{seats}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bottom Row - Full Width */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Image Upload */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Car Image</label>
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${
                        isDragActive ? "border-red-500 bg-red-50" : "border-gray-300"
                      }`}
                    >
                      <input {...getInputProps()} />
                      {image ? (
                        <p className="text-green-600">{image.name}</p>
                      ) : (
                        <p className="text-gray-500">
                          {isDragActive ? "Drop the image here" : "Drag & drop image, or click to select"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                      isSubmitting ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {isSubmitting ? "Creating..." : "Create Car"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}