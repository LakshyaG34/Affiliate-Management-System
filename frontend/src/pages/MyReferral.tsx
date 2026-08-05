import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    FaUsers,
    FaUser,
    FaCalendarAlt,
    FaShoppingCart,
    FaMoneyBillWave,
    FaCheckCircle,
    FaClock,
    FaSearch,
    FaFilter,
    FaArrowUp,
    FaArrowDown,
    FaChevronDown,
    FaChevronUp,
    FaUserPlus,
} from "react-icons/fa";

import {
    referralApi,
    type Referral,
} from "@/services/apiService";

const MyReferrals = () => {
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"date" | "name">("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [expandedMobileRow, setExpandedMobileRow] = useState<string | null>(null);

    const fetchReferrals = async () => {
        try {
            const res = await referralApi.getMyReferrals();
            setReferrals(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReferrals();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "bg-green-100 text-green-800 border-green-200";
            default:
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return <FaCheckCircle className="w-4 h-4" />;
            default:
                return <FaClock className="w-4 h-4" />;
        }
    };

    const getStatusLabel = (status: string) => {
        return status === "ACTIVE" ? "Active" : "Pending Purchase";
    };

    // Filter and sort referrals
    const filteredReferrals = referrals
        .filter(referral => {
            const matchesSearch =
                referral.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                referral.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterStatus === "all" || referral.status === filterStatus;
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            if (sortBy === "date") {
                const dateA = new Date(a.joinedAt).getTime();
                const dateB = new Date(b.joinedAt).getTime();
                return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
            } else {
                return sortOrder === "desc"
                    ? b.name.localeCompare(a.name)
                    : a.name.localeCompare(b.name);
            }
        });

    // Stats
    const stats = {
        total: referrals.length,
        active: referrals.filter(r => r.status === "ACTIVE").length,
        pending: referrals.filter(r => r.status !== "ACTIVE").length,
        totalPurchases: referrals.reduce((sum, r) => sum + r.totalPurchases, 0),
        totalCommission: referrals.reduce((sum, r) => sum + r.totalCommissionEarned, 0),
    };

    // Mobile card view
    const MobileReferralCard = ({ referral }: { referral: Referral }) => {
        const isExpanded = expandedMobileRow === referral.id;

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
                                    {referral.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {referral.email}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                                <p className="text-xs text-gray-500">Joined</p>
                                <p className="text-sm font-medium text-gray-700">
                                    {new Date(referral.joinedAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Status</p>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(referral.status)}`}>
                                    {getStatusIcon(referral.status)}
                                    {getStatusLabel(referral.status)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setExpandedMobileRow(isExpanded ? null : referral.id)}
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
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center">
                                <p className="text-xs text-gray-500">Purchases</p>
                                <p className="text-lg font-bold text-blue-600">
                                    {referral.totalPurchases}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500">Amount</p>
                                <p className="text-lg font-bold text-purple-600">
                                    ₹{referral.totalPurchaseAmount}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500">Commission</p>
                                <p className="text-lg font-bold text-green-600">
                                    ₹{referral.totalCommissionEarned}
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            My Referrals
                        </h1>
                        <p className="text-sm md:text-base text-gray-500 mt-1">
                            Track your referred affiliates and their performance
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-blue-50 rounded-xl">
                            <FaUserPlus className="w-4 h-4 text-blue-600" />
                            <span className="text-xs md:text-sm font-semibold text-blue-600">
                                {stats.total} Total
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
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
                            <FaUsers className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
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
                            <p className="text-xs md:text-sm text-gray-500">Active</p>
                            <p className="text-xl md:text-2xl font-bold text-green-600">{stats.active}</p>
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-xl flex items-center justify-center">
                            <FaCheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
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
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl md:rounded-2xl shadow-lg p-3 md:p-4 text-white"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs md:text-sm text-white/80">Total Commission</p>
                            <p className="text-base md:text-2xl font-bold">
                                ₹{stats.totalCommission}
                            </p>
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <FaMoneyBillWave className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-3 md:p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
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
                                <option value="ACTIVE">Active</option>
                                <option value="PENDING">Pending Purchase</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as "date" | "name")}
                                className="px-2 md:px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-sm"
                            >
                                <option value="date">Date</option>
                                <option value="name">Name</option>
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

            {/* Referrals Table - Desktop */}
            <div className="hidden md:block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {filteredReferrals.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaUsers className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-gray-500">No referrals found</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Start sharing your referral link to earn commissions!
                        </p>
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
                                        Joined
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Purchases
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Commission
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredReferrals.map((referral, index) => (
                                    <motion.tr
                                        key={referral.id}
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
                                                    <p className="font-medium text-gray-800">{referral.name}</p>
                                                    <p className="text-sm text-gray-500">{referral.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                <FaCalendarAlt className="w-3 h-3 text-gray-400" />
                                                {new Date(referral.joinedAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-600">
                                                <FaShoppingCart className="w-3 h-3" />
                                                {referral.totalPurchases}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <p className="font-semibold text-purple-600">
                                                ₹{referral.totalPurchaseAmount}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <p className="font-semibold text-green-600">
                                                ₹{referral.totalCommissionEarned}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(referral.status)}`}>
                                                {getStatusIcon(referral.status)}
                                                {getStatusLabel(referral.status)}
                                            </span>
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
                {filteredReferrals.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaUsers className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-gray-500">No referrals found</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Start sharing your referral link to earn commissions!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredReferrals.map((referral) => (
                            <MobileReferralCard key={referral.id} referral={referral} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyReferrals;