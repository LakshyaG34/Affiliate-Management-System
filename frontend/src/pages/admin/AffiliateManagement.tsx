import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaDollarSign,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaWallet,
  FaSearch,
  FaFilter,
  FaArrowUp,
  FaArrowDown,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaUser,
  FaCalendarAlt,
  FaTimes,
  FaExternalLinkAlt,
  FaTag,
} from "react-icons/fa";

import {
  commissionApi,
  type Affiliate,
  type AffiliateDetails,
  type Commission,
  type Payout,
} from "@/services/apiService";

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const fmtDateTime = (d: string) => {
  const date = new Date(d);
  return {
    date: date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

// ─── Status Badges ──────────────────────────────────────────────────────────

const commissionStatusConfig: Record<
  string,
  { color: string; icon: React.ReactNode; label: string }
> = {
  APPROVED: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: <FaCheckCircle className="w-3 h-3" />,
    label: "Approved",
  },
  REJECTED: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: <FaTimesCircle className="w-3 h-3" />,
    label: "Rejected",
  },
  PAID: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: <FaWallet className="w-3 h-3" />,
    label: "Paid",
  },
  PENDING: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: <FaClock className="w-3 h-3" />,
    label: "Pending",
  },
};

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = commissionStatusConfig[status] ?? commissionStatusConfig.PENDING;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
};

// ─── Details Drawer ──────────────────────────────────────────────────────────

const AffiliateDrawer = ({
  affiliateId,
  onClose,
}: {
  affiliateId: string | null;
  onClose: () => void;
}) => {
  const [details, setDetails] = useState<AffiliateDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"commissions" | "payouts" | "referrals">(
    "commissions"
  );

  useEffect(() => {
    if (!affiliateId) return;
    setLoading(true);
    setDetails(null);
    setActiveTab("commissions");
    commissionApi
      .getAffiliateDetails(affiliateId)
      .then((res) => setDetails(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [affiliateId]);

  return (
    <AnimatePresence>
      {affiliateId && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50 flex-shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {loading || !details ? "Loading…" : details.name}
                </h2>
                {details && (
                  <p className="text-sm text-gray-500">{details.email}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <FaTimes className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : details ? (
              <div className="flex-1 overflow-y-auto">
                {/* Quick stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-6 bg-gradient-to-br from-slate-50 to-blue-50 border-b border-gray-100">
                  <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-500">Referrals</p>
                    <p className="text-xl font-bold text-gray-800">
                      {details.stats.referralCount}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-500">Total Sales</p>
                    <p className="text-lg font-bold text-gray-800">
                      {fmt(details.stats.totalSales)}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-500">Commission</p>
                    <p className="text-lg font-bold text-green-600">
                      {fmt(details.stats.totalCommission)}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-500">Approved</p>
                    <p className="text-lg font-bold text-blue-600">
                      {fmt(details.stats.approvedCommission)}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-500">Paid Out</p>
                    <p className="text-lg font-bold text-purple-600">
                      {fmt(details.stats.paidCommission)}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-500">Available</p>
                    <p className="text-lg font-bold text-emerald-600">
                      {fmt(details.stats.availableBalance)}
                    </p>
                  </div>
                </div>

                {/* Referral code */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <FaTag className="text-gray-400 w-3.5 h-3.5" />
                  <span className="text-sm text-gray-500">Referral Code:</span>
                  <code className="bg-gray-100 text-blue-700 px-2.5 py-0.5 rounded-md text-sm font-mono font-semibold tracking-wide">
                    {details.referralCode}
                  </code>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 px-6 bg-white sticky top-0 z-10">
                  {(["commissions", "payouts", "referrals"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      {tab}{" "}
                      <span className="ml-1 text-xs font-normal text-gray-400">
                        (
                        {tab === "commissions"
                          ? details.commissions.length
                          : tab === "payouts"
                            ? details.payouts.length
                            : details.referrals.length}
                        )
                      </span>
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {/* Commissions Tab */}
                  {activeTab === "commissions" && (
                    <div className="space-y-3">
                      {details.commissions.length === 0 ? (
                        <EmptyState message="No commissions yet" />
                      ) : (
                        details.commissions.map((c: Commission) => {
                          const dt = fmtDateTime(c.createdAt);
                          return (
                            <div
                              key={c.id}
                              className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="font-medium text-gray-800 text-sm truncate">
                                    {c.purchase.user.name}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {c.purchase.user.email}
                                  </p>
                                </div>
                                <StatusBadge status={c.status} />
                              </div>
                              <div className="flex items-center gap-4 mt-3">
                                <div>
                                  <p className="text-xs text-gray-400">Purchase</p>
                                  <p className="text-sm font-semibold text-gray-700">
                                    {fmt(c.purchase.purchaseAmount)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">Commission</p>
                                  <p className="text-sm font-semibold text-green-600">
                                    {fmt(c.commissionAmount)}
                                  </p>
                                </div>
                                <div className="ml-auto text-right">
                                  <p className="text-xs text-gray-400">{dt.date}</p>
                                  <p className="text-xs text-gray-400">{dt.time}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {/* Payouts Tab */}
                  {activeTab === "payouts" && (
                    <div className="space-y-3">
                      {details.payouts.length === 0 ? (
                        <EmptyState message="No payouts yet" />
                      ) : (
                        details.payouts.map((p: Payout) => {
                          const dt = fmtDateTime(p.createdAt);
                          return (
                            <div
                              key={p.id}
                              className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-semibold text-purple-600">
                                  {fmt(p.payoutAmount)}
                                </p>
                                <StatusBadge status={p.status} />
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-gray-400">
                                  {p.commissions.length} commission
                                  {p.commissions.length !== 1 ? "s" : ""} included
                                </p>
                                <p className="text-xs text-gray-400">
                                  {dt.date} · {dt.time}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {/* Referrals Tab */}
                  {activeTab === "referrals" && (
                    <div className="space-y-3">
                      {details.referrals.length === 0 ? (
                        <EmptyState message="No referrals yet" />
                      ) : (
                        details.referrals.map((r) => (
                          <div
                            key={r.id}
                            className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="font-medium text-gray-800 text-sm truncate">
                                  {r.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {r.email}
                                </p>
                              </div>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium border ${r.status === "ACTIVE"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                  }`}
                              >
                                {r.status === "ACTIVE" ? "Active" : "Pending"}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                              <p className="text-xs text-gray-400 ml-auto">
                                Joined {fmtDate(r.joinedAt)}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-10">
    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
      <FaDollarSign className="w-6 h-6 text-gray-300" />
    </div>
    <p className="text-gray-400 text-sm">{message}</p>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

const AffiliateManagement = () => {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 10;

  // Drawer
  const [selectedAffiliateId, setSelectedAffiliateId] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch affiliates
  const fetchAffiliates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await commissionApi.getAllAffiliates({
        page,
        limit: LIMIT,
        search: debouncedSearch,
        sortBy,
        sortOrder,
      });
      const { affiliates: list, pagination } = res.data.data;
      setAffiliates(list);
      setTotalPages(pagination.totalPages);
      setTotal(pagination.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, sortBy, sortOrder]);

  useEffect(() => {
    fetchAffiliates();
  }, [fetchAffiliates]);

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field)
      return <FaArrowDown className="w-3 h-3 text-gray-300 inline ml-1" />;
    return sortOrder === "desc" ? (
      <FaArrowDown className="w-3 h-3 text-blue-500 inline ml-1" />
    ) : (
      <FaArrowUp className="w-3 h-3 text-blue-500 inline ml-1" />
    );
  };

  // ── Pagination range
  const pageNumbers = (() => {
    const delta = 2;
    const range: (number | "…")[] = [];
    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }
    if (page - delta > 2) range.unshift("…");
    if (page + delta < totalPages - 1) range.push("…");
    if (totalPages > 1) range.unshift(1);
    if (totalPages > 1) range.push(totalPages);
    return range;
  })();

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Affiliate Management
        </h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">
          Overview of all affiliates and their performance
        </p>
      </div>

      {/* Search & Sort */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email, or referral code…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400 w-4 h-4 flex-shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-sm"
            >
              <option value="createdAt">Joined Date</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
            </select>
            <button
              onClick={() => {
                setSortOrder((o) => (o === "desc" ? "asc" : "desc"));
                setPage(1);
              }}
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

      {/* ── Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : affiliates.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUsers className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No affiliates found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => toggleSort("name")}
                      className="hover:text-gray-700 transition-colors"
                    >
                      Affiliate <SortIcon field="name" />
                    </button>
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referral Code
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referrals
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Sales
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => toggleSort("createdAt")}
                      className="hover:text-gray-700 transition-colors"
                    >
                      Joined <SortIcon field="createdAt" />
                    </button>
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {affiliates.map((affiliate, index) => (
                  <motion.tr
                    key={affiliate.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <FaUser className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate max-w-[160px]">
                            {affiliate.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate max-w-[160px]">
                            {affiliate.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <code className="bg-gray-100 text-blue-700 px-2.5 py-1 rounded-md text-xs font-mono font-semibold tracking-wide">
                        {affiliate.referralCode}
                      </code>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-600">
                          {affiliate.referralCount}
                        </span>
                        <span className="text-sm text-gray-500">users</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-gray-800">
                        {fmt(affiliate.totalSales)}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-green-600">
                        {fmt(affiliate.totalCommission)}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-emerald-600">
                        {fmt(affiliate.availableBalance)}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <FaCalendarAlt className="w-3 h-3 text-gray-400" />
                        {fmtDate(affiliate.joinedAt)}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => setSelectedAffiliateId(affiliate.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-medium rounded-lg transition-colors border border-blue-100"
                      >
                        <FaEye className="w-3 h-3" />
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Mobile Cards */}
      <div className="md:hidden space-y-3 mb-5">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : affiliates.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUsers className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500">No affiliates found</p>
          </div>
        ) : (
          affiliates.map((affiliate) => (
            <div
              key={affiliate.id}
              className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaUser className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">{affiliate.name}</p>
                    <p className="text-xs text-gray-500 truncate">{affiliate.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAffiliateId(affiliate.id)}
                  className="flex-shrink-0 w-8 h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center transition-colors border border-blue-100 ml-2"
                >
                  <FaExternalLinkAlt className="w-3 h-3" />
                </button>
              </div>

              <div className="mb-3">
                <code className="bg-gray-100 text-blue-700 px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold">
                  {affiliate.referralCode}
                </code>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-400">Referrals</p>
                  <p className="font-semibold text-gray-700">{affiliate.referralCount}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-400">Sales</p>
                  <p className="font-semibold text-gray-700">{fmt(affiliate.totalSales)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-400">Commission</p>
                  <p className="font-semibold text-green-600">{fmt(affiliate.totalCommission)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-400">Available</p>
                  <p className="font-semibold text-emerald-600">
                    {fmt(affiliate.availableBalance)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                <FaCalendarAlt className="w-3 h-3" />
                Joined {fmtDate(affiliate.joinedAt)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Pagination */}
      {!loading && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-4 py-3 bg-white rounded-xl shadow-lg border border-gray-100">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-800">{(page - 1) * LIMIT + 1}</span> to{" "}
            <span className="font-semibold text-gray-800">
              {Math.min(page * LIMIT, total)}
            </span>{" "}
            of <span className="font-semibold text-gray-800">{total}</span> affiliates
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
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
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
                Page {page} of {totalPages}
              </span>
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${page === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                }`}
            >
              <span className="flex items-center gap-2">
                Next
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Details Drawer */}
      <AffiliateDrawer
        affiliateId={selectedAffiliateId}
        onClose={() => setSelectedAffiliateId(null)}
      />
    </div>
  );
};

export default AffiliateManagement;
