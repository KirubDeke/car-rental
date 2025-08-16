"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  FiEdit,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiUpload,
  FiX,
} from "react-icons/fi";
import Header from "../../../../components/Header";
import Sidebar from "../../../../components/Sidebar";
import { useAuth } from "../../../../context/AuthContext";
import { useRouter } from "next/navigation";

interface Fleet {
  id: number;
  brand: string;
  model: string;
  year: number;
  plateNumber: string;
  type: string;
  pricePerDay: string;
  fuelType: string;
  seats: number;
  transmission: string;
  image: string;
  description: string;
  bookedDates: any[];
  maintenanceMode: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function FleetManagement() {
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedFleet, setSelectedFleet] = useState<Fleet | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fleetToDelete, setFleetToDelete] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Fleet>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const itemsPerPage = 10;

  useEffect(() => {
    if(!isAuthenticated){
      router.push("/login");
    }else{
       fetchFleets();
    }
  }, [currentPage,isAuthenticated, router]);

  const fetchFleets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}kirub-rental/fleets/all?page=${currentPage}&limit=${itemsPerPage}`
      );

      setFleets(response.data.data);
      setTotalItems(response.data.total);
      setTotalPages(Math.ceil(response.data.total / itemsPerPage));
    } catch (error) {
      toast.error("Failed to fetch fleets");
      console.error("Error fetching fleets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (fleet: Fleet) => {
    setEditData(fleet);
    setPreviewImage(`${process.env.NEXT_PUBLIC_BASE_URL}uploads/cars/${fleet.image}`);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editData.id) return;

    try {
      setIsUpdating(true);
      
      const formData = new FormData();
      
      // Append all fields to formData
      Object.entries(editData).forEach(([key, value]) => {
        if (key !== 'image' && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      // Append image if it's a new file
      if (previewImage && previewImage.startsWith('blob:')) {
        const blob = await fetch(previewImage).then(r => r.blob());
        formData.append('image', blob, 'vehicle-image.jpg');
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}kirub-rental/fleets/updateFleet/${editData.id}`,
        formData,
        {
          withCredentials: true
        }
      );
      
      toast.success("Vehicle updated successfully");
      fetchFleets();
      setShowEditModal(false);
    } catch (error) {
      toast.error("Failed to update vehicle");
      console.error("Error updating fleet:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setFleetToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!fleetToDelete) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}kirub-rental/fleets/deleteFleet/${fleetToDelete}`, {
          withCredentials: true
        }
      );
      toast.success("Vehicle deleted successfully");
      fetchFleets();
    } catch (error) {
      toast.error("Failed to delete vehicle");
      console.error("Error deleting fleet:", error);
    } finally {
      setShowDeleteModal(false);
      setFleetToDelete(null);
    }
  };

  const handleViewDetails = (fleet: Fleet) => {
    setSelectedFleet(fleet);
    setShowDetails(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Please upload an image file');
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price: string) => {
    return `ETB ${parseFloat(price).toFixed(2)}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-red-500 p-4">
              <h2 className="text-xl font-bold text-white">Fleet Management</h2>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Image
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Brand/Model
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Details
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {fleets.map((fleet) => (
                          <tr key={fleet.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex-shrink-0 h-10 w-16">
                                <img
                                  className="h-10 w-16 object-cover rounded"
                                  src={`${process.env.NEXT_PUBLIC_BASE_URL}uploads/cars/${fleet.image}`}
                                  alt={`${fleet.brand} ${fleet.model}`}
                                />
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {fleet.brand}
                              </div>
                              <div className="text-sm text-gray-500">
                                {fleet.model}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {fleet.year} • {fleet.type}
                              </div>
                              <div className="text-sm text-gray-500">
                                {fleet.seats} seats • {fleet.transmission}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatPrice(fleet.pricePerDay)}/day
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  fleet.maintenanceMode
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {fleet.maintenanceMode
                                  ? "Maintenance"
                                  : "Available"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => handleViewDetails(fleet)}
                                  className="text-gray-800 hover:text-gray-600"
                                  title="View Details"
                                >
                                  <FiEye className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleEditClick(fleet)}
                                  className="text-gray-800 hover:text-gray-600"
                                  title="Edit"
                                >
                                  <FiEdit className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(fleet.id)}
                                  className="text-gray-800 hover:text-gray-600"
                                  title="Delete"
                                >
                                  <FiTrash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Vehicle Details Modal */}
                  {showDetails && selectedFleet && (
                    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold">
                            {selectedFleet.brand} {selectedFleet.model} Details
                          </h3>
                          <button
                            onClick={() => setShowDetails(false)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <img
                              className="w-full h-48 object-cover rounded-lg mb-4"
                              src={`${process.env.NEXT_PUBLIC_BASE_URL}uploads/cars/${selectedFleet.image}`}
                              alt={`${selectedFleet.brand} ${selectedFleet.model}`}
                            />

                            <div className="space-y-2">
                              <h4 className="font-semibold">Description</h4>
                              <p className="text-gray-600">
                                {selectedFleet.description ||
                                  "No description available"}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold">Plate Number</h4>
                                <p>{selectedFleet.plateNumber}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold">Year</h4>
                                <p>{selectedFleet.year}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold">Type</h4>
                                <p>{selectedFleet.type}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold">Seats</h4>
                                <p>{selectedFleet.seats}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold">Transmission</h4>
                                <p>{selectedFleet.transmission}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold">Fuel Type</h4>
                                <p>{selectedFleet.fuelType}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold">Price Per Day</h4>
                                <p>{formatPrice(selectedFleet.pricePerDay)}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold">Status</h4>
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    selectedFleet.maintenanceMode
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {selectedFleet.maintenanceMode
                                    ? "Maintenance"
                                    : "Available"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Edit Vehicle Modal */}
                  {showEditModal && (
                    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold">Edit Vehicle</h3>
                          <button
                            onClick={() => setShowEditModal(false)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Image Upload Section */}
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Vehicle Image
                            </label>
                            <div
                              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                                isDragging
                                  ? "border-red-500 bg-red-50"
                                  : "border-gray-300 hover:border-gray-400"
                              }`}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop}
                            >
                              {previewImage ? (
                                <div className="relative">
                                  <img
                                    src={previewImage}
                                    alt="Preview"
                                    className="mx-auto h-48 object-contain rounded-lg"
                                  />
                                  <button
                                    onClick={removeImage}
                                    className="absolute top-0 right-0 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                                  >
                                    <FiX className="h-5 w-5 text-gray-600" />
                                  </button>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                                  <p className="text-sm text-gray-600">
                                    Drag and drop an image here, or click to select
                                  </p>
                                  <input
                                    type="file"
                                    id="image-upload"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                  />
                                  <label
                                    htmlFor="image-upload"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer"
                                  >
                                    Select Image
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>
                          {/* Vehicle Details Form */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Brand
                            </label>
                            <input
                              type="text"
                              name="brand"
                              value={editData.brand || ''}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Model
                            </label>
                            <input
                              type="text"
                              name="model"
                              value={editData.model || ''}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Year
                            </label>
                            <input
                              type="number"
                              name="year"
                              value={editData.year || ''}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Plate Number
                            </label>
                            <input
                              type="text"
                              name="plateNumber"
                              value={editData.plateNumber || ''}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Type
                            </label>
                            <input
                              type="text"
                              name="type"
                              value={editData.type || ''}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Price Per Day (ETB)
                            </label>
                            <input
                              type="text"
                              name="pricePerDay"
                              value={editData.pricePerDay || ''}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Fuel Type
                            </label>
                            <select
                              name="fuelType"
                              value={editData.fuelType || ''}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            >
                              <option value="Gasoline">Gasoline</option>
                              <option value="Diesel">Diesel</option>
                              <option value="Electric">Electric</option>
                              <option value="Hybrid">Hybrid</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Seats
                            </label>
                            <input
                              type="number"
                              name="seats"
                              value={editData.seats || ''}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Transmission
                            </label>
                            <select
                              name="transmission"
                              value={editData.transmission || ''}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            >
                              <option value="Automatic">Automatic</option>
                              <option value="Manual">Manual</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Status
                            </label>
                            <select
                              name="maintenanceMode"
                              value={editData.maintenanceMode ? 'true' : 'false'}
                              onChange={(e) => 
                                setEditData(prev => ({ 
                                  ...prev, 
                                  maintenanceMode: e.target.value === 'true' 
                                }))
                              }
                              className="w-full p-2 border border-gray-300 rounded-md"
                            >
                              <option value="false">Available</option>
                              <option value="true">Maintenance</option>
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <textarea
                              name="description"
                              value={editData.description || ''}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-gray-300 rounded-md"
                              rows={3}
                            />
                          </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                          <button
                            onClick={() => setShowEditModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleUpdate}
                            disabled={isUpdating}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-red-300 flex items-center"
                          >
                            {isUpdating ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                              </>
                            ) : 'Save Changes'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Delete Confirmation Modal */}
                  {showDeleteModal && (
                    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <FiTrash2 className="w-8 h-8 text-red-600" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Delete Vehicle
                          </h3>
                          <p className="text-gray-600 text-center mb-6">
                            Are you sure you want to delete this vehicle? This action cannot be undone.
                          </p>
                          <div className="flex space-x-4 w-full">
                            <button
                              onClick={() => setShowDeleteModal(false)}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleDeleteConfirm}
                              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {(currentPage - 1) * itemsPerPage + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, totalItems)}
                      </span>{" "}
                      of <span className="font-medium">{totalItems}</span>{" "}
                      vehicles
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === 1
                            ? "bg-gray-200 cursor-not-allowed"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }`}
                      >
                        <FiChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === totalPages
                            ? "bg-gray-200 cursor-not-allowed"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }`}
                      >
                        <FiChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}