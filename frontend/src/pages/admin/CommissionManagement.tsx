import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import {
    FaUsers,
    FaDollarSign,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaSearch,
    FaFilter,
    FaEye,
    FaCheck,
    FaTimes,
    FaChartLine,
    FaCalendarAlt,
    FaWallet,
    FaUser,
    FaShoppingCart,
} from "react-icons/fa";

import { adminApi, type Commission } from "@/services/apiService";

const CommissionManagement = () => {
    const [commissions, setCommissions] = useState<Commission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);

    const fetchCommissions = async () => {
        try {
            const res = await adminApi.getAllCommissions();
            setCommissions(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (
        commissionId: string,
        status: "APPROVED" | "REJECTED"
    ) => {
        try {
            await adminApi.updateCommissionStatus(commissionId, status);
            fetchCommissions();
        } catch (error) {
            console.error(error);
        }
    };

    const handleApprove = async (commission: Commission) => {
        const result = await Swal.fire({
            title: "Approve Commission?",
            html: `
        <div class="text-left">
          <div class="mb-3 p-3 bg-gray-50 rounded-lg">
            <p class="flex items-center gap-2 mb-1">
              <span class="text-gray-500">Affiliate:</span>
              <strong>${commission.affiliate.name}</strong>
            </p>
            <p class="flex items-center gap-2 mb-1">
              <span class="text-gray-500">Email:</span>
              <span class="text-sm">${commission.affiliate.email}</span>
            </p>
            <p class="flex items-center gap-2 mb-1">
              <span class="text-gray-500">Purchase:</span>
              <strong>₹${commission.purchase.purchaseAmount}</strong>
            </p>
            <p class="flex items-center gap-2">
              <span class="text-gray-500">Commission:</span>
              <strong class="text-green-600">₹${commission.commissionAmount}</strong>
            </p>
          </div>
        </div>
      `,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#10B981",
            cancelButtonColor: "#6B7280",
            confirmButtonText: "Approve",
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
                title: "Approving...",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            try {
                await handleStatusUpdate(commission.id, "APPROVED");

                Swal.fire({
                    title: "Approved!",
                    text: `Commission of ₹${commission.commissionAmount} has been approved.`,
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
                    text: "Failed to approve commission. Please try again.",
                    icon: "error",
                    confirmButtonColor: "#EF4444",
                    customClass: {
                        popup: 'rounded-2xl',
                    },
                });
            }
        }
    };

    const handleReject = async (commission: Commission) => {
        const result = await Swal.fire({
            title: "Reject Commission?",
            html: `
        <div class="text-left">
          <div class="mb-3 p-3 bg-gray-50 rounded-lg">
            <p class="flex items-center gap-2 mb-1">
              <span class="text-gray-500">Affiliate:</span>
              <strong>${commission.affiliate.name}</strong>
            </p>
            <p class="flex items-center gap-2 mb-1">
              <span class="text-gray-500">Commission:</span>
              <strong class="text-red-600">₹${commission.commissionAmount}</strong>
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
            confirmButtonText: "Reject",
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
                await handleStatusUpdate(commission.id, "REJECTED");

                Swal.fire({
                    title: "Rejected!",
                    text: `Commission has been rejected.`,
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
                    text: "Failed to reject commission. Please try again.",
                    icon: "error",
                    confirmButtonColor: "#EF4444",
                    customClass: {
                        popup: 'rounded-2xl',
                    },
                });
            }
        }
    };

    const handleViewDetails = (commission: Commission) => {
        setSelectedCommission(commission);
    };

    const closeDetails = () => {
        setSelectedCommission(null);
    };

    useEffect(() => {
        fetchCommissions();
    }, []);

    // Filter and search commissions
    const filteredCommissions = commissions.filter(commission => {
        const matchesSearch =
            commission.affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            commission.affiliate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            commission.purchase.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            commission.purchase.user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" || commission.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "APPROVED":
                return "bg-green-100 text-green-800 border-green-200";
            case "REJECTED":
                return "bg-red-100 text-red-800 border-red-200";
            case "PAID":
                return "bg-blue-100 text-blue-800 border-blue-200";
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
            case "PAID":
                return <FaWallet className="w-4 h-4" />;
            default:
                return <FaClock className="w-4 h-4" />;
        }
    };

    // Stats
    const stats = {
        total: commissions.length,
        pending: commissions.filter(c => c.status === "PENDING").length,
        approved: commissions.filter(c => c.status === "APPROVED").length,
        rejected: commissions.filter(c => c.status === "REJECTED").length,
        paid: commissions.filter(c => c.status === "PAID").length,
        totalAmount: commissions.reduce((sum, c) => sum + c.commissionAmount, 0),
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
                    Commission Management
                </h1>
                <p className="text-gray-500 mt-1">
                    Review and manage affiliate commissions
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <FaChartLine className="w-5 h-5 text-blue-600" />
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
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Paid</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.paid}</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <FaWallet className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="text-2xl font-bold text-purple-600">
                                ₹{stats.totalAmount.toFixed(2)}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                            <FaDollarSign className="w-5 h-5 text-purple-600" />
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
                            placeholder="Search by name, email..."
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
                            <option value="PAID">Paid</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Commissions Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {filteredCommissions.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaDollarSign className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-gray-500">No commissions found</p>
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
                                        Buyer
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Purchase
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Commission
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredCommissions.map((commission, index) => (
                                    <motion.tr
                                        key={commission.id}
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
                                                    <p className="font-medium text-gray-800">{commission.affiliate.name}</p>
                                                    <p className="text-sm text-gray-500">{commission.affiliate.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-medium text-gray-800">{commission.purchase.user.name}</p>
                                            <p className="text-xs text-gray-500">{commission.purchase.user.email}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-gray-800">
                                                ₹{commission.purchase.purchaseAmount}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-green-600">
                                                ₹{commission.commissionAmount}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(commission.status)}`}>
                                                {getStatusIcon(commission.status)}
                                                {commission.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(commission)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View details"
                                                >
                                                    <FaEye className="w-4 h-4" />
                                                </button>
                                                {commission.status === "PENDING" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(commission)}
                                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Approve"
                                                        >
                                                            <FaCheck className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(commission)}
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
                {selectedCommission && (
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
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Commission Details</h3>

                            <div className="space-y-4">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Affiliate</p>
                                    <p className="font-medium">{selectedCommission.affiliate.name}</p>
                                    <p className="text-sm text-gray-600">{selectedCommission.affiliate.email}</p>
                                </div>

                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Buyer</p>
                                    <p className="font-medium">{selectedCommission.purchase.user.name}</p>
                                    <p className="text-sm text-gray-600">{selectedCommission.purchase.user.email}</p>
                                </div>

                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Purchase Amount</p>
                                    <p className="text-xl font-bold text-gray-800">
                                        ₹{selectedCommission.purchase.purchaseAmount}
                                    </p>
                                </div>

                                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                                    <p className="text-sm text-gray-500">Commission Amount</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        ₹{selectedCommission.commissionAmount}
                                    </p>
                                </div>

                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Status</p>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedCommission.status)}`}>
                                        {getStatusIcon(selectedCommission.status)}
                                        {selectedCommission.status}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                {selectedCommission.status === "PENDING" && (
                                    <>
                                        <button
                                            onClick={() => {
                                                closeDetails();
                                                handleApprove(selectedCommission);
                                            }}
                                            className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => {
                                                closeDetails();
                                                handleReject(selectedCommission);
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

export default CommissionManagement;