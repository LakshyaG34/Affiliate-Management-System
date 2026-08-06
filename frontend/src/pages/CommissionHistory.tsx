import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaDollarSign,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaChartLine,
  FaWallet,
  FaUser,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaChevronDown,
  FaChevronUp,
  FaPaperPlane,
  FaCheck,
  FaHourglassHalf,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import {
  commissionApi,
  type Commission,
} from "@/services/apiService";

import Swal from "sweetalert2";
import { payoutApi } from "@/services/apiService";

const LIMIT = 10;

const CommissionHistory = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [expandedMobileRow, setExpandedMobileRow] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const fetchCommissions = async () => {
    try {
      const res = await commissionApi.getMyCommissions({
        page,
        limit: LIMIT,
      });

      setCommissions(res.data.data.commissions);
      setPagination(res.data.data.pagination);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async (commissionId: string) => {
    const result = await Swal.fire({
      title: "Request Payout?",
      html: `
        <div class="text-left">
          <div class="p-4 bg-blue-50 rounded-lg mb-3">
            <p class="text-sm text-gray-600 mb-2">You are about to request a payout for this commission.</p>
            <div class="flex items-center justify-between border-t border-blue-100 pt-2">
              <span class="text-gray-600">Commission Amount</span>
              <span class="text-xl font-bold text-blue-600">₹${commissions.find(c => c.id === commissionId)?.commissionAmount || 0}</span>
            </div>
          </div>
          <p class="text-sm text-gray-500">The payout will be processed within 3-5 business days.</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3B82F6",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Request Payout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        confirmButton: 'px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors',
        cancelButton: 'px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors',
        popup: 'rounded-2xl',
        title: 'text-2xl font-bold',
      },
    });

    if (!result.isConfirmed) return;

    try {
      Swal.fire({
        title: "Processing...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await payoutApi.requestPayout([commissionId]);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Payout request submitted successfully.",
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-2xl',
        },
      });

      fetchCommissions();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to request payout",
        confirmButtonColor: "#EF4444",
        customClass: {
          popup: 'rounded-2xl',
        },
      });
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, [page]);

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

  const getStatusLabel = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  // Filter and sort commissions
  const filteredCommissions = commissions
    .filter(commission => {
      const matchesSearch =
        commission.purchase.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commission.purchase.user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "all" || commission.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      } else {
        return sortOrder === "desc"
          ? b.commissionAmount - a.commissionAmount
          : a.commissionAmount - b.commissionAmount;
      }
    });

  // Stats
  const stats = {
    total: commissions.length,
    pending: commissions.filter(c => c.status === "PENDING").length,
    approved: commissions.filter(c => c.status === "APPROVED").length,
    paid: commissions.filter(c => c.status === "PAID").length,
    totalAmount: commissions.reduce((sum, c) => sum + c.commissionAmount, 0),
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const totalPages = pagination.totalPages;
    const currentPage = page;
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "…", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "…", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "…", currentPage - 1, currentPage, currentPage + 1, "…", totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Mobile card view
  const MobileCommissionCard = ({ commission }: { commission: Commission }) => {
    const isExpanded = expandedMobileRow === commission.id;

    return (
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-3 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaUser className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {commission.purchase.user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {commission.purchase.user.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <p className="text-xs text-gray-500">Purchase Amount</p>
                <p className="font-semibold text-gray-800">
                  ₹{commission.purchase.purchaseAmount}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Commission</p>
                <p className="font-semibold text-green-600">
                  ₹{commission.commissionAmount}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setExpandedMobileRow(isExpanded ? null : commission.id)}
            className="ml-2 p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            {isExpanded ? <FaChevronUp className="w-4 h-4 text-gray-500" /> : <FaChevronDown className="w-4 h-4 text-gray-500" />}
          </button>
        </div>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 pt-3 border-t border-gray-100"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(commission.status)}`}>
                  {getStatusIcon(commission.status)}
                  {getStatusLabel(commission.status)}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-medium text-gray-700">
                  {new Date(commission.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(commission.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Mobile Action Button */}
            <div className="mt-4">
              {commission.status === "APPROVED" && !commission.payoutId ? (
                <button
                  onClick={() => handleRequestPayout(commission.id)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-md shadow-blue-200"
                >
                  <FaPaperPlane className="w-4 h-4" />
                  Request Payout
                </button>
              ) : commission.status === "APPROVED" ? (
                <div className="flex items-center justify-center gap-2 text-orange-600 font-medium bg-orange-50 py-2 rounded-lg border border-orange-200">
                  <FaHourglassHalf className="w-4 h-4" />
                  <span>Payout Requested</span>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </div>
    );
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
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          My Commissions
        </h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">
          Track your affiliate earnings and commission status
        </p>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-3 md:p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">Total</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <FaChartLine className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-3 md:p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">Pending</p>
              <p className="text-xl md:text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <FaClock className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-3 md:p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">Approved</p>
              <p className="text-xl md:text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <FaCheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl md:rounded-2xl shadow-lg p-3 md:p-4 text-white col-span-2 md:col-span-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-white/80">Earnings</p>
              <p className="text-lg md:text-2xl font-bold">
                ₹{stats.totalAmount.toFixed(2)}
              </p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FaDollarSign className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filter - Responsive */}
      <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-3 md:p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by buyer name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-1 sm:flex-none">
              <FaFilter className="text-gray-400 w-4 h-4" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 sm:flex-none px-3 md:px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-sm"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="PAID">Paid</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "amount")}
                className="px-2 md:px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-sm"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
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
      </div>

      {/* Commissions Table - Desktop */}
      <div className="hidden md:block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {filteredCommissions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaDollarSign className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500">No commissions found</p>
            <p className="text-sm text-gray-400 mt-1">
              Start referring and earning commissions today!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Buyer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purchase Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
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
                          <p className="font-medium text-gray-800">
                            {commission.purchase.user.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {commission.purchase.user.email}
                          </p>
                        </div>
                      </div>
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
                        {getStatusLabel(commission.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <FaCalendarAlt className="w-3 h-3 text-gray-400" />
                        {new Date(commission.createdAt).toLocaleDateString()}
                      </div>
                      <p className="text-xs text-gray-400">
                        {new Date(commission.createdAt).toLocaleTimeString()}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {commission.status === "APPROVED" && !commission.payoutId ? (
                        <button
                          onClick={() => handleRequestPayout(commission.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium transition-all duration-200 shadow-md shadow-blue-200"
                        >
                          <FaPaperPlane className="w-3.5 h-3.5" />
                          Request
                        </button>
                      ) : commission.status === "APPROVED" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
                          <FaHourglassHalf className="w-3.5 h-3.5" />
                          Requested
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile Cards View */}
      <div className="md:hidden">
        {filteredCommissions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaDollarSign className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500">No commissions found</p>
            <p className="text-sm text-gray-400 mt-1">
              Start referring and earning commissions today!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCommissions.map((commission) => (
              <MobileCommissionCard key={commission.id} commission={commission} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination - Improved UI */}
      {pagination.totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-4 py-3 bg-white rounded-xl shadow-lg border border-gray-100">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-800">{(page - 1) * LIMIT + 1}</span> to{" "}
            <span className="font-semibold text-gray-800">
              {Math.min(page * LIMIT, pagination.total)}
            </span>{" "}
            of <span className="font-semibold text-gray-800">{pagination.total}</span> commissions
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                }`}
            >
              <span className="flex items-center gap-2">
                <FaChevronLeft className="w-4 h-4" />
                Previous
              </span>
            </button>

            {/* Page numbers */}
            <div className="hidden sm:flex items-center gap-1">
              {pageNumbers.map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} className="w-10 text-center text-gray-400 text-sm">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${page === p
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200"
                        : "text-gray-700 hover:bg-gray-50 hover:border-gray-300 border border-transparent hover:border-gray-200"
                      }`}
                  >
                    {p}
                  </button>
                )
              )}
            </div>

            {/* Mobile page indicator */}
            <div className="sm:hidden flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Page {page} of {pagination.totalPages}
              </span>
            </div>

            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${page === pagination.totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                }`}
            >
              <span className="flex items-center gap-2">
                Next
                <FaChevronRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommissionHistory;