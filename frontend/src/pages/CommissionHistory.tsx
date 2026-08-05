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
} from "react-icons/fa";

import {
  commissionApi,
  type Commission,
} from "@/services/apiService";

const CommissionHistory = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [expandedMobileRow, setExpandedMobileRow] = useState<string | null>(null);

  const fetchCommissions = async () => {
    try {
      const res = await commissionApi.getMyCommissions();
      setCommissions(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, []);

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
    </div>
  );
};

export default CommissionHistory;