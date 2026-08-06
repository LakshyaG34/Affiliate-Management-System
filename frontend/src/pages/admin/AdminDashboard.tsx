import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaDollarSign,
  FaShoppingCart,
  FaLink,
  FaClock,
  FaCheckCircle,
  FaWallet,
  FaChartLine,
  FaTrophy,
  FaArrowUp,
  FaArrowDown,
  FaBolt,
} from "react-icons/fa";
import { MdPending } from "react-icons/md";
import { HiOutlineUserGroup } from "react-icons/hi";

import {
  commissionApi,
  type PlatformStats,
  type Affiliate,
} from "@/services/apiService";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

// ─── Animation variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
  subtitle?: string;
  highlight?: boolean;
}

const StatCard = ({ title, value, icon, gradient, subtitle, highlight }: StatCardProps) => (
  <motion.div
    variants={cardVariants}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className={`rounded-2xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 ${
      highlight
        ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-blue-500"
        : "bg-white border-gray-100"
    }`}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${highlight ? "text-blue-100" : "text-gray-500"}`}>
          {title}
        </p>
        <h2 className={`mt-2 text-3xl font-bold ${highlight ? "text-white" : "text-gray-800"}`}>
          {value}
        </h2>
        {subtitle && (
          <p className={`mt-1 text-xs ${highlight ? "text-blue-200" : "text-gray-400"}`}>
            {subtitle}
          </p>
        )}
      </div>
      <div
        className={`rounded-2xl p-3 shadow-lg flex-shrink-0 ${
          highlight ? "bg-white/20" : gradient
        }`}
      >
        <div className={highlight ? "text-white" : "text-white"}>{icon}</div>
      </div>
    </div>
  </motion.div>
);

// ─── Commission Breakdown Bar ─────────────────────────────────────────────────

const CommissionBar = ({
  pending,
  approved,
  paid,
  total,
}: {
  pending: number;
  approved: number;
  paid: number;
  total: number;
}) => {
  if (total === 0) return null;
  const pPct = (pending / total) * 100;
  const aPct = (approved / total) * 100;
  const dPct = (paid / total) * 100;

  return (
    <div>
      <div className="flex rounded-full overflow-hidden h-3 bg-gray-100">
        <div
          className="bg-yellow-400 transition-all duration-700"
          style={{ width: `${pPct}%` }}
        />
        <div
          className="bg-green-500 transition-all duration-700"
          style={{ width: `${aPct}%` }}
        />
        <div
          className="bg-blue-500 transition-all duration-700"
          style={{ width: `${dPct}%` }}
        />
      </div>
      <div className="flex items-center gap-4 mt-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="text-xs text-gray-500">Pending</span>
          <span className="text-xs font-semibold text-gray-700">{fmt(pending)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="text-xs text-gray-500">Approved</span>
          <span className="text-xs font-semibold text-gray-700">{fmt(approved)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className="text-xs text-gray-500">Paid</span>
          <span className="text-xs font-semibold text-gray-700">{fmt(paid)}</span>
        </div>
      </div>
    </div>
  );
};

// ─── Top Affiliates Table ─────────────────────────────────────────────────────

const TopAffiliatesTable = ({ affiliates }: { affiliates: Affiliate[] }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
      <div className="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center">
        <FaTrophy className="w-4 h-4 text-yellow-600" />
      </div>
      <div>
        <h3 className="font-bold text-gray-800">Top Affiliates</h3>
        <p className="text-xs text-gray-500">Ranked by total commission earned</p>
      </div>
    </div>

    {affiliates.length === 0 ? (
      <div className="text-center py-10">
        <FaUsers className="w-8 h-8 text-gray-200 mx-auto mb-2" />
        <p className="text-sm text-gray-400">No affiliates yet</p>
      </div>
    ) : (
      <div className="divide-y divide-gray-50">
        {affiliates.slice(0, 5).map((affiliate, index) => (
          <motion.div
            key={affiliate.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.06 }}
            className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors"
          >
            {/* Rank */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                index === 0
                  ? "bg-yellow-100 text-yellow-700"
                  : index === 1
                  ? "bg-gray-100 text-gray-600"
                  : index === 2
                  ? "bg-orange-100 text-orange-600"
                  : "bg-gray-50 text-gray-400"
              }`}
            >
              {index + 1}
            </div>

            {/* Avatar */}
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-blue-600">
                {affiliate.name?.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 text-sm truncate">{affiliate.name}</p>
              <p className="text-xs text-gray-400 truncate">{affiliate.email}</p>
            </div>

            {/* Referrals */}
            <div className="text-right flex-shrink-0 hidden sm:block">
              <p className="text-xs text-gray-400">Referrals</p>
              <p className="text-sm font-semibold text-indigo-600">{affiliate.referralCount}</p>
            </div>

            {/* Commission */}
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-400">Commission</p>
              <p className="text-sm font-bold text-green-600">
                {fmt(affiliate.totalCommission)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>
);

// ─── Quick Insight Card ───────────────────────────────────────────────────────

const InsightCard = ({
  icon,
  label,
  body,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  body: string;
  accent: string;
}) => (
  <div className={`rounded-2xl p-5 border ${accent}`}>
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{body}</p>
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [topAffiliates, setTopAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      commissionApi.getPlatformStats(),
      commissionApi.getTopAffiliates(),
    ])
      .then(([statsRes, affiliatesRes]) => {
        setStats(statsRes.data.data);
        setTopAffiliates(affiliatesRes.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaChartLine className="w-10 h-10 text-red-400" />
          </div>
          <p className="text-gray-500 mb-4">Failed to load dashboard</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalCommission =
    stats.pendingCommissionAmount + stats.approvedCommissionAmount + stats.paidCommissionAmount;

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <HiOutlineUserGroup size={22} />,
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
      subtitle: "Registered on platform",
    },
    {
      title: "Total Referrals",
      value: stats.totalReferrals,
      icon: <FaLink size={20} />,
      gradient: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      subtitle: "Users joined via referral",
    },
    {
      title: "Total Purchases",
      value: stats.totalPurchases,
      icon: <FaShoppingCart size={20} />,
      gradient: "bg-gradient-to-br from-green-500 to-green-600",
      subtitle: "Successful transactions",
    },
    {
      title: "Total Revenue",
      value: fmt(stats.totalRevenue),
      icon: <FaChartLine size={20} />,
      gradient: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      subtitle: "From successful purchases",
      highlight: true,
    },
    {
      title: "Pending Commissions",
      value: fmt(stats.pendingCommissionAmount),
      icon: <FaClock size={20} />,
      gradient: "bg-gradient-to-br from-yellow-500 to-yellow-600",
      subtitle: "Awaiting your approval",
    },
    {
      title: "Approved Commissions",
      value: fmt(stats.approvedCommissionAmount),
      icon: <FaCheckCircle size={20} />,
      gradient: "bg-gradient-to-br from-teal-500 to-teal-600",
      subtitle: "Ready for payout",
    },
    {
      title: "Paid Commissions",
      value: fmt(stats.paidCommissionAmount),
      icon: <FaWallet size={20} />,
      gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
      subtitle: "Disbursed to affiliates",
    },
    {
      title: "Pending Payouts",
      value: fmt(stats.pendingPayoutAmount),
      icon: <MdPending size={22} />,
      gradient: "bg-gradient-to-br from-red-500 to-red-600",
      subtitle: "Payout requests pending",
    },
    {
      title: "Approved Payouts",
      value: fmt(stats.approvedPayoutAmount),
      icon: <FaDollarSign size={20} />,
      gradient: "bg-gradient-to-br from-pink-500 to-pink-600",
      subtitle: "Approved for disbursement",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {getGreeting()}! 👋
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            Here's your affiliate program at a glance
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl self-start sm:self-auto">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-gray-600 font-medium">Admin</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8"
      >
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </motion.div>

      {/* Commission Breakdown + Top Affiliates */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
        {/* Breakdown panel — takes 2 cols on lg */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col gap-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
              <FaBolt className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Commission Breakdown</h3>
              <p className="text-xs text-gray-500">Total: {fmt(totalCommission)}</p>
            </div>
          </div>

          <CommissionBar
            pending={stats.pendingCommissionAmount}
            approved={stats.approvedCommissionAmount}
            paid={stats.paidCommissionAmount}
            total={totalCommission}
          />

          {/* Payout summary */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Payout Summary
            </p>
            <div className="flex gap-4">
              <div className="flex-1 bg-orange-50 rounded-xl p-3 border border-orange-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <FaArrowDown className="w-3 h-3 text-orange-500" />
                  <p className="text-xs text-orange-600 font-medium">Pending</p>
                </div>
                <p className="font-bold text-gray-800 text-sm">
                  {fmt(stats.pendingPayoutAmount)}
                </p>
              </div>
              <div className="flex-1 bg-green-50 rounded-xl p-3 border border-green-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <FaArrowUp className="w-3 h-3 text-green-500" />
                  <p className="text-xs text-green-600 font-medium">Approved</p>
                </div>
                <p className="font-bold text-gray-800 text-sm">
                  {fmt(stats.approvedPayoutAmount)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top Affiliates — takes 3 cols on lg */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-3"
        >
          <TopAffiliatesTable affiliates={topAffiliates} />
        </motion.div>
      </div>

      {/* Quick Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <InsightCard
          icon={
            <div className="w-9 h-9 bg-yellow-100 rounded-xl flex items-center justify-center">
              <FaClock className="w-4 h-4 text-yellow-600" />
            </div>
          }
          label="Pending Action"
          body={`${fmt(stats.pendingCommissionAmount)} in commissions awaiting your review. Approving promptly keeps affiliates motivated.`}
          accent="bg-yellow-50 border-yellow-100"
        />
        <InsightCard
          icon={
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <FaUsers className="w-4 h-4 text-blue-600" />
            </div>
          }
          label="Network Growth"
          body={`${stats.totalReferrals} of your ${stats.totalUsers} users joined through referrals — a ${stats.totalUsers > 0 ? Math.round((stats.totalReferrals / stats.totalUsers) * 100) : 0}% referral conversion rate.`}
          accent="bg-blue-50 border-blue-100"
        />
        <InsightCard
          icon={
            <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
              <FaChartLine className="w-4 h-4 text-green-600" />
            </div>
          }
          label="Revenue Efficiency"
          body={`${fmt(stats.totalCommission)} paid in commissions against ${fmt(stats.totalRevenue)} in revenue — a ${stats.totalRevenue > 0 ? ((stats.totalCommission / stats.totalRevenue) * 100).toFixed(1) : 0}% commission rate.`}
          accent="bg-green-50 border-green-100"
        />
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
