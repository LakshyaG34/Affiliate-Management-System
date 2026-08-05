import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import {
  FaWallet,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSearch,
  FaFilter,
  FaEye,
  FaCheck,
  FaTimes,
  FaUser,
  FaDollarSign,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

import {
  payoutApi,
  type Payout,
} from "@/services/apiService";

const PayoutManagement = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchPayouts = async () => {
    try {
      const res = await payoutApi.getAllPayouts();
      setPayouts(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    payoutId: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      await payoutApi.updatePayoutStatus(payoutId, status);
      fetchPayouts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async (payout: Payout) => {
    const result = await Swal.fire({
      title: "Approve Payout?",
      html: `
        <div class="text-left">
          <div class="p-4 bg-gray-50 rounded-lg mb-3">
            <p class="flex items-center gap-2 mb-2">
              <span class="text-gray-500">Affiliate:</span>
              <strong>${payout.affiliate.name}</strong>
            </p>
            <p class="flex items-center gap-2 mb-2">
              <span class="text-gray-500">Email:</span>
              <span class="text-sm">${payout.affiliate.email}</span>
            </p>
            <p class="flex items-center gap-2">
              <span class="text-gray-500">Amount:</span>
              <strong class="text-green-600 text-lg">₹${payout.payoutAmount}</strong>
            </p>
          </div>
          <p class="text-sm text-gray-500">This will process the payout to the affiliate.</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Approve Payout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        confirmButton: 'px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors',
        cancelButton: 'px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors',
        popup: 'rounded-2xl',
        title: 'text-2xl font-bold',
      },
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Processing...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        await handleStatusUpdate(payout.id, "APPROVED");
        
        Swal.fire({
          title: "Approved!",
          text: `Payout of ₹${payout.payoutAmount} has been approved.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-2xl',
          },
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to approve payout. Please try again.",
          icon: "error",
          confirmButtonColor: "#EF4444",
          customClass: {
            popup: 'rounded-2xl',
          },
        });
      }
    }
  };

  const handleReject = async (payout: Payout) => {
    const result = await Swal.fire({
      title: "Reject Payout?",
      html: `
        <div class="text-left">
          <div class="p-4 bg-gray-50 rounded-lg mb-3">
            <p class="flex items-center gap-2 mb-2">
              <span class="text-gray-500">Affiliate:</span>
              <strong>${payout.affiliate.name}</strong>
            </p>
            <p class="flex items-center gap-2 mb-2">
              <span class="text-gray-500">Amount:</span>
              <strong class="text-red-600">₹${payout.payoutAmount}</strong>
            </p>
          </div>
          <div class="mb-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Reason for rejection (optional):</label>
            <textarea id="rejection-reason" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" rows="3" placeholder="Enter reason..."></textarea>
          </div>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Reject Payout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        confirmButton: 'px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors',
        cancelButton: 'px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors',
        popup: 'rounded-2xl',
        title: 'text-2xl font-bold',
      },
      preConfirm: () => {
        const reason = (document.getElementById('rejection-reason') as HTMLTextAreaElement)?.value;
        return reason || "No reason provided";
      },
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Rejecting...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        await handleStatusUpdate(payout.id, "REJECTED");
        
        Swal.fire({
          title: "Rejected!",
          text: "Payout has been rejected.",
          icon: "info",
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-2xl',
          },
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to reject payout. Please try again.",
          icon: "error",
          confirmButtonColor: "#EF4444",
          customClass: {
            popup: 'rounded-2xl',
          },
        });
      }
    }
  };

  const handleViewDetails = (payout: Payout) => {
    setSelectedPayout(payout);
  };

  const closeDetails = () => {
    setSelectedPayout(null);
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <FaCheckCircle className="w-4 h-4" />;
      case "REJECTED":
        return <FaTimesCircle className="w-4 h-4" />;
      default:
        return <FaClock className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  // Filter and sort payouts
  const filteredPayouts = payouts
    .filter(payout => {
      const matchesSearch = 
        payout.affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payout.affiliate.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "all" || payout.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      } else {
        return sortOrder === "desc" 
          ? b.payoutAmount - a.payoutAmount 
          : a.payoutAmount - b.payoutAmount;
      }
    });

  // Stats
  const stats = {
    total: payouts.length,
    pending: payouts.filter(p => p.status === "PENDING").length,
    approved: payouts.filter(p => p.status === "APPROVED").length,
    rejected: payouts.filter(p => p.status === "REJECTED").length,
    totalAmount: payouts.reduce((sum, p) => sum + p.payoutAmount, 0),
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Payout Management
        </h1>
        <p className="text-gray-500 mt-1">
          Review and manage affiliate payout requests
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Payouts</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <FaWallet className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <FaClock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <FaCheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Total Amount</p>
              <p className="text-2xl font-bold">
                ₹{stats.totalAmount.toFixed(2)}
              </p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FaDollarSign className="w-5 h-5 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by affiliate name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400 w-4 h-4" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "amount")}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
              className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              title={sortOrder === "desc" ? "Descending" : "Ascending"}
            >
              {sortOrder === "desc" ? (
                <FaArrowDown className="w-4 h-4 text-gray-600" />
              ) : (
                <FaArrowUp className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {filteredPayouts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaWallet className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500">No payouts found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Affiliate
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayouts.map((payout, index) => (
                  <motion.tr
                    key={payout.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <FaUser className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{payout.affiliate.name}</p>
                          <p className="text-sm text-gray-500">{payout.affiliate.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-green-600">
                        ₹{payout.payoutAmount}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(payout.status)}`}>
                        {getStatusIcon(payout.status)}
                        {getStatusLabel(payout.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <FaCalendarAlt className="w-3 h-3 text-gray-400" />
                        {new Date(payout.createdAt).toLocaleDateString()}
                      </div>
                      <p className="text-xs text-gray-400">
                        {new Date(payout.createdAt).toLocaleTimeString()}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewDetails(payout)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View details"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        {payout.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleApprove(payout)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <FaCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(payout)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <FaTimes className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedPayout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeDetails}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Payout Details</h3>
              
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Affiliate</p>
                  <p className="font-medium">{selectedPayout.affiliate.name}</p>
                  <p className="text-sm text-gray-600">{selectedPayout.affiliate.email}</p>
                </div>

                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-sm text-gray-500">Payout Amount</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{selectedPayout.payoutAmount}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedPayout.status)}`}>
                    {getStatusIcon(selectedPayout.status)}
                    {getStatusLabel(selectedPayout.status)}
                  </span>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="text-gray-700">
                    {new Date(selectedPayout.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                {selectedPayout.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => {
                        closeDetails();
                        handleApprove(selectedPayout);
                      }}
                      className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        closeDetails();
                        handleReject(selectedPayout);
                      }}
                      className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={closeDetails}
                  className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PayoutManagement;