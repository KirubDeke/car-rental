"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiEdit, FiTrash2, FiChevronLeft, FiChevronRight, FiEye } from "react-icons/fi";
import Header from "../../../../components/Header";
import Sidebar from "../../../../components/Sidebar";

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
  const itemsPerPage = 10;

  useEffect(() => {
    fetchFleets();
  }, [currentPage]);

  const fetchFleets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/kirub-rental/fleets/all?page=${currentPage}&limit=${itemsPerPage}`
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

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await axios.delete(`http://localhost:8000/kirub-rental/fleets/${id}`);
        toast.success("Vehicle deleted successfully");
        fetchFleets();
      } catch (error) {
        toast.error("Failed to delete vehicle");
        console.error("Error deleting fleet:", error);
      }
    }
  };

  const handleViewDetails = (fleet: Fleet) => {
    setSelectedFleet(fleet);
    setShowDetails(true);
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand/Model</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                              <div className="text-sm font-medium text-gray-900">{fleet.brand}</div>
                              <div className="text-sm text-gray-500">{fleet.model}</div>
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
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                fleet.maintenanceMode ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                              }`}>
                                {fleet.maintenanceMode ? "Maintenance" : "Available"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => handleViewDetails(fleet)}
                                  className="text-gray-800 hover:text-gray-600"
                                >
                                  <FiEye className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => {/* Add edit functionality */}}
                                  className="text-gray-800 hover:text-gray-600"
                                >
                                  <FiEdit className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(fleet.id)}
                                  className="text-gray-800 hover:text-gray-600"
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
                              <p className="text-gray-600">{selectedFleet.description || "No description available"}</p>
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
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  selectedFleet.maintenanceMode ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                                }`}>
                                  {selectedFleet.maintenanceMode ? "Maintenance" : "Available"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, totalItems)}
                      </span>{' '}
                      of <span className="font-medium">{totalItems}</span> vehicles
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'}`}
                      >
                        <FiChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'}`}
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