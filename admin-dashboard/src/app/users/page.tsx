"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiEye, FiTrash2, FiUser, FiMail, FiPhone, FiEdit, FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";

interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  photo?: string;
  createdAt: string;
  role?: "admin" | "user" | "manager"; 
}

const roleColors = {
  admin: "bg-purple-100 text-purple-800",
  user: "bg-blue-100 text-blue-800",
  manager: "bg-green-100 text-green-800",
};

export default function UsersDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}kirub-rental/users/getAllUsers`,
        {
          params: {
            page: currentPage,
            limit: usersPerPage,
          }
        }
      );

      console.log("API Response:", response.data);

      if (response.data.status === "success") {
        const usersData = Array.isArray(response.data.data) 
          ? response.data.data 
          : Object.values(response.data.data || {});
        
        setUsers(usersData);
        setTotalUsers(response.data.totalCount || usersData.length);
      } else {
        toast.error(response.data.message || "Failed to fetch users");
      }
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}kirub-rental/users/deleteUser/${userToDelete}`
      );
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
      console.error("Error deleting user:", error);
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = dateString ? new Date(dateString) : new Date();
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return "N/A";
    }
  };

  const filteredUsers = users.filter((user) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (user.fullName?.toLowerCase().includes(searchLower)) ||
      (user.email?.toLowerCase().includes(searchLower)) ||
      (user.phoneNumber?.toLowerCase().includes(searchLower)) ||
      (user.id?.toString().includes(searchTerm)) ||
      (user.role?.toLowerCase().includes(searchLower))
    );
  });

  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-red-500 p-4">
              <h2 className="text-xl font-bold text-white">
                Users Management
              </h2>
            </div>

            <div className="p-6">
              {/* Search Section */}
              <div className="mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-600" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name, email, phone, role or ID..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  {searchTerm ? (
                    <>
                      <div className="text-gray-500 text-lg mb-2">
                        No users found matching "{searchTerm}"
                      </div>
                      <button
                        onClick={() => setSearchTerm("")}
                        className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                      >
                        Clear search
                      </button>
                    </>
                  ) : (
                    <div className="text-gray-500 text-lg">
                      No users available in the system
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <FiUser className="inline mr-1 text-gray-600" />
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <FiMail className="inline mr-1 text-gray-600" />
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <FiPhone className="inline mr-1 text-gray-600" />
                            Phone
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              #{user.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {user.photo ? (
                                  <img
                                    src={user.photo}
                                    alt={user.fullName || "User"}
                                    className="h-8 w-8 rounded-full mr-2 object-cover"
                                  />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                    <FiUser className="text-gray-600" />
                                  </div>
                                )}
                                <div className="text-sm font-medium text-gray-900">
                                  {user.fullName || "N/A"}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.email || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.phoneNumber || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(user.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                                  roleColors[user.role || "user"] ||
                                  "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {user.role || "user"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex space-x-3 justify-end">
                                <button
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setShowUserModal(true);
                                  }}
                                  className="text-gray-800 hover:text-gray-900 transition-colors"
                                  title="View Details"
                                >
                                  <FiEye className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => {
                                    toast("Edit functionality coming soon");
                                  }}
                                  className="text-gray-800 hover:text-gray-900 transition-colors"
                                  title="Edit User"
                                >
                                  <FiEdit className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(user.id)}
                                  className="text-gray-800 hover:text-gray-900 transition-colors"
                                  title="Delete User"
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

                  {/* Pagination */}
                  {totalUsers > 0 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * usersPerPage + 1}</span> to{" "}
                        <span className="font-medium">
                          {Math.min(currentPage * usersPerPage, totalUsers)}
                        </span>{" "}
                        of <span className="font-medium">{totalUsers}</span> users
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => paginate(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                          <FiChevronLeft className="text-gray-600" />
                        </button>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => paginate(pageNum)}
                              className={`px-3 py-1 rounded-md ${currentPage === pageNum ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        <button
                          onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                          <FiChevronRight className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* User Details Modal */}
              <Modal
                isOpen={showUserModal}
                onClose={() => setShowUserModal(false)}
                title="User Details"
              >
                {selectedUser && (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      {selectedUser.photo ? (
                        <img
                          src={selectedUser.photo}
                          alt={selectedUser.fullName || "User"}
                          className="h-24 w-24 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                          <FiUser className="text-gray-600 text-4xl" />
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <DetailItem
                        label="Name"
                        value={selectedUser.fullName || "N/A"}
                      />
                      <DetailItem
                        label="Email"
                        value={selectedUser.email || "N/A"}
                      />
                      <DetailItem
                        label="Phone"
                        value={selectedUser.phoneNumber || "N/A"}
                      />
                      <DetailItem
                        label="User ID"
                        value={selectedUser.id?.toString() || "N/A"}
                      />
                      <DetailItem
                        label="Role"
                        value={selectedUser.role || "user"}
                      />
                      <DetailItem
                        label="Joined Date"
                        value={formatDate(selectedUser.createdAt)}
                      />
                    </div>
                  </div>
                )}
              </Modal>

              {/* Delete Confirmation Modal */}
              <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete User"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <FiTrash2 className="w-8 h-8 text-red-600" />
                  </div>
                  <p className="text-gray-600 text-center mb-6">
                    Are you sure you want to delete this user? This
                    action cannot be undone.
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
              </Modal>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Reusable Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Reusable Detail Item Component
interface DetailItemProps {
  label: string;
  value: string;
}

const DetailItem = ({ label, value }: DetailItemProps) => (
  <div>
    <h4 className="font-semibold text-gray-500 text-sm">{label}</h4>
    <p className="text-gray-900">{value}</p>
  </div>
);