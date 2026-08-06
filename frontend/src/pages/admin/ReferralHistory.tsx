import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    FaUsers,
    FaUser,
    FaSearch,
    // FaDollarSign,
    FaCheckCircle,
    FaClock,
    FaCalendarAlt,
    FaChevronDown,
    FaChevronUp,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";

import { adminApi } from "@/services/apiService";
import type { AdminReferral } from "@/services/apiService";

const LIMIT = 10;

const ReferralHistory = () => {
    const [referrals, setReferrals] = useState<AdminReferral[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [expandedMobileRow, setExpandedMobileRow] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: LIMIT,
        total: 0,
        totalPages: 1,
    });

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 400);
        return () => clearTimeout(t);
    }, [searchTerm]);

    const fetchReferrals = async () => {
        setLoading(true);
        try {
            const res = await adminApi.getReferralHistory({
                page,
                limit: LIMIT,
                search: debouncedSearch,
            });
            setReferrals(res.data.data.referrals);
            setPagination(res.data.data.pagination);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReferrals();
    }, [page, debouncedSearch]);

    const getStatusColor = (status: string) =>
        status === "ACTIVE"
            ? "bg-green-100 text-green-800 border-green-200"
            : "bg-yellow-100 text-yellow-800 border-yellow-200";

    const getStatusIcon = (status: string) =>
        status === "ACTIVE" ? (
            <FaCheckCircle className="w-3.5 h-3.5" />
        ) : (
            <FaClock className="w-3.5 h-3.5" />
        );

    const getStatusLabel = (status: string) =>
        status === "ACTIVE" ? "Active" : "Pending Purchase";

    // Pagination page numbers with ellipsis
    const getPageNumbers = () => {
        const totalPages = pagination.totalPages;
        const currentPage = page;
        const pages: (number | string)[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
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

    // ── Mobile card ────────────────────────────────────────────────────────────
    const MobileReferralCard = ({ referral }: { referral: AdminReferral }) => {
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
                                    {referral.name || <span className="italic text-gray-400">No name</span>}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{referral.email}</p>
                            </div>
                        </div>

                        {/* <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <p className="text-xs text-gray-500">Revenue</p>
                <p className="font-semibold text-gray-800">
                  ₹{referral.totalPurchaseAmount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Commission</p>
                <p className="font-semibold text-green-600">
                  ₹{referral.totalCommission.toFixed(2)}
                </p>
              </div>
            </div> */}
                    </div>

                    <button
                        onClick={() => setExpandedMobileRow(isExpanded ? null : referral.id)}
                        className="ml-2 p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                    >
                        {isExpanded ? (
                            <FaChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                            <FaChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                    </button>
                </div>

                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-3 pt-3 border-t border-gray-100 space-y-3"
                    >
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-xs text-gray-500">Affiliate</p>
                                {referral.affiliate ? (
                                    <>
                                        <p className="text-sm font-medium text-gray-700">
                                            {referral.affiliate.name || "—"}
                                        </p>
                                        <p className="text-xs text-gray-400">{referral.affiliate.email}</p>
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-400">—</p>
                                )}
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Joined</p>
                                <p className="text-sm font-medium text-gray-700">
                                    {new Date(referral.joinedAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Status</p>
                                <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(referral.status)}`}
                                >
                                    {getStatusIcon(referral.status)}
                                    {getStatusLabel(referral.status)}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        );
    };

    if (loading && referrals.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            {/* ── Page Header ── */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Referral History
                </h1>
                <p className="text-sm md:text-base text-gray-500 mt-1">
                    Track referred users and affiliate performance
                </p>
            </div>

            {/* ── Search ── */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-3 md:p-4 mb-6">
                <div className="relative max-w-sm">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                    />
                </div>
            </div>

            {/* ── Desktop Table ── */}
            <div className="hidden md:block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {referrals.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaUsers className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-gray-500">No referrals found</p>
                        <p className="text-sm text-gray-400 mt-1">
                            {searchTerm
                                ? "Try a different search term"
                                : "Referred users will appear here"}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    {[
                                        "Referred User",
                                        "Affiliate",
                                        "Joined",
                                        "Status",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading
                                    ? [...Array(6)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            {[...Array(7)].map((__, j) => (
                                                <td key={j} className="px-4 py-4">
                                                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                    : referrals.map((referral, index) => (
                                        <motion.tr
                                            key={referral.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.04 }}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            {/* Referred User */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <FaUser className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">
                                                            {referral.name || (
                                                                <span className="italic text-gray-400">No name</span>
                                                            )}
                                                        </p>
                                                        <p className="text-sm text-gray-500">{referral.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Affiliate */}
                                            <td className="px-4 py-3">
                                                {referral.affiliate ? (
                                                    <div>
                                                        <p className="font-medium text-gray-800">
                                                            {referral.affiliate.name || "—"}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {referral.affiliate.email}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </td>

                                            {/* Joined */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <FaCalendarAlt className="w-3 h-3 text-gray-400" />
                                                    {new Date(referral.joinedAt).toLocaleDateString()}
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(referral.status)}`}
                                                >
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

            {/* ── Mobile Cards ── */}
            <div className="md:hidden">
                {referrals.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaUsers className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-gray-500">No referrals found</p>
                        <p className="text-sm text-gray-400 mt-1">
                            {searchTerm ? "Try a different search term" : "Referred users will appear here"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {referrals.map((referral) => (
                            <MobileReferralCard key={referral.id} referral={referral} />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Pagination ── */}
            {pagination.totalPages > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-4 py-3 bg-white rounded-xl shadow-lg border border-gray-100">
                    <p className="text-sm text-gray-600">
                        Showing{" "}
                        <span className="font-semibold text-gray-800">
                            {(page - 1) * LIMIT + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-semibold text-gray-800">
                            {Math.min(page * LIMIT, pagination.total)}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-gray-800">{pagination.total}</span>{" "}
                        referrals
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

                        {/* Page numbers — desktop */}
                        <div className="hidden sm:flex items-center gap-1">
                            {pageNumbers.map((p, i) =>
                                p === "…" ? (
                                    <span
                                        key={`ellipsis-${i}`}
                                        className="w-10 text-center text-gray-400 text-sm"
                                    >
                                        …
                                    </span>
                                ) : (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p as number)}
                                        className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${page === p
                                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200"
                                            : "text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200"
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

export default ReferralHistory;