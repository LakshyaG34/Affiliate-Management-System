import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaWallet,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSearch,
  FaFilter,
  FaEye,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaChartLine,
  FaChevronDown,
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import {
  payoutApi,
  dashboardApi,
  type Payout,
  type DashboardData,
} from "@/services/apiService";

const LIMIT = 10;

const PayoutHistory = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [expandedMobileRow, setExpandedMobileRow] = useState<string | null>(null);

  const fetchPayouts = async () => {
    try {
      const [payoutRes, dashboardRes] = await Promise.all([
        payoutApi.getMyPayouts({
          page,
          limit: LIMIT,
        }),
        dashboardApi.getDashboard(),
      ]);

      setPayouts(payoutRes.data.data.payouts);
      setPagination(payoutRes.data.data.pagination);
      setDashboard(dashboardRes.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const availableBalance = dashboard?.approvedCommission ?? 0;

  const handleViewDetails = (payout: Payout) => {
    setSelectedPayout(payout);
  };

  const closeDetails = () => {
    setSelectedPayout(null);
  };

  useEffect(() => {
    fetchPayouts();
  }, [page]);

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
      const matchesFilter = filterStatus === "all" || payout.status === filterStatus;
      return matchesFilter;
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
  const MobilePayoutCard = ({ payout }: { payout: Payout }) => {
    const isExpanded = expandedMobileRow === payout.id;

    return (
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-3 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-green-600 text-lg">
                ₹{payout.payoutAmount}
              </p>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(payout.status)}`}>
                {getStatusIcon(payout.status)}
                {getStatusLabel(payout.status)}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500">
              <FaCalendarAlt className="w-3 h-3 text-gray-400" />
              {new Date(payout.createdAt).toLocaleDateString()}
            </div>
          </div>

          <button
            onClick={() => setExpandedMobileRow(isExpanded ? null : payout.id)}
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
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(payout.status)}`}>
                  {getStatusIcon(payout.status)}
                  {getStatusLabel(payout.status)}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-medium text-gray-700">
                  {new Date(payout.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(payout.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <button
                onClick={() => handleViewDetails(payout)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <FaEye className="w-4 h-4" />
                View Details
              </button>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              My Payouts
            </h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              Track your payout requests and history
            </p>
          </div>
        </div>
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
              <FaWallet className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
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
              <p className="text-xs md:text-sm text-gray-500">Balance</p>
              <p className="text-xl md:text-2xl font-bold text-emerald-600">₹{availableBalance.toFixed(2)}</p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <FaWallet className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
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
              <p className="text-xs md:text-sm text-white/80">Total</p>
              <p className="text-base md:text-2xl font-bold">
                ₹{stats.totalAmount.toFixed(2)}
              </p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FaChartLine className="w-4 h-4 md:w-5 md:h-5 text-white" />
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
              placeholder="Search payouts..."
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

      {/* Payouts Table - Desktop */}
      <div className="hidden md:block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {filteredPayouts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaWallet className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500">No payouts found</p>
            <p className="text-sm text-gray-400 mt-1">
              Request your first payout when you have available balance
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
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
                      <p className="font-semibold text-green-600 text-lg">
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
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleViewDetails(payout)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View details"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                      </div>
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
        {filteredPayouts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaWallet className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500">No payouts found</p>
            <p className="text-sm text-gray-400 mt-1">
              Request your first payout when you have available balance
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPayouts.map((payout) => (
              <MobilePayoutCard key={payout.id} payout={payout} />
            ))}
          </div>
        )}
      </div>

      {/* Details Modal - Responsive */}
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
              className="bg-white rounded-2xl max-w-md w-full p-5 md:p-6 max-h-[90vh] overflow-y-auto mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Payout Details</h3>

              <div className="space-y-4">
                <div className="p-3 md:p-4 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-xs md:text-sm text-gray-500">Payout Amount</p>
                  <p className="text-xl md:text-2xl font-bold text-green-600">
                    ₹{selectedPayout.payoutAmount}
                  </p>
                </div>

                <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-500">Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedPayout.status)}`}>
                    {getStatusIcon(selectedPayout.status)}
                    {getStatusLabel(selectedPayout.status)}
                  </span>
                </div>

                <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-500">Created At</p>
                  <p className="text-sm md:text-base text-gray-700">
                    {new Date(selectedPayout.createdAt).toLocaleString()}
                  </p>
                </div>

                {selectedPayout.updatedAt && (
                  <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs md:text-sm text-gray-500">Last Updated</p>
                    <p className="text-sm md:text-base text-gray-700">
                      {new Date(selectedPayout.updatedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={closeDetails}
                  className="w-full px-4 py-2.5 md:py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination - Improved UI */}
      {pagination.totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-4 py-3 bg-white rounded-xl shadow-lg border border-gray-100">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-800">{(page - 1) * LIMIT + 1}</span> to{" "}
            <span className="font-semibold text-gray-800">
              {Math.min(page * LIMIT, pagination.total)}
            </span>{" "}
            of <span className="font-semibold text-gray-800">{pagination.total}</span> payouts
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                page === 1
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
                    className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                      page === p
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
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                page === pagination.totalPages
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

export default PayoutHistory;