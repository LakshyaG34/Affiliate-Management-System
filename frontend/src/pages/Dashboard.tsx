import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaShoppingCart,
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
  FaWallet,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaUserFriends,
  FaDollarSign,
  FaGift,
  FaTrophy,
} from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";
import { MdPending, MdApproval } from "react-icons/md";

import {
  dashboardApi,
  type Dashboard,
} from "@/services/apiService";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardApi.getDashboard();
        setDashboard(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaChartLine className="w-10 h-10 text-red-400" />
          </div>
          <p className="text-gray-500">Failed to load dashboard</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const isAdmin = dashboard.role === "ADMIN";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,  // Added "as const" for proper TypeScript typing
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const Card = ({
    title,
    value,
    icon,
    color,
    subtitle,
    trend,
    trendValue,
  }: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
    trend?: "up" | "down";
    trendValue?: string;
  }) => (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-800">
            {value}
          </h2>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
              {trend === "up" ? <FaArrowUp className="w-3 h-3" /> : <FaArrowDown className="w-3 h-3" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`rounded-2xl p-3 ${color} shadow-lg`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Admin Cards Configuration
  const adminCards = [
    {
      title: "Total Users",
      value: dashboard.totalUsers ?? 0,
      icon: <HiOutlineUserGroup size={24} />,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      subtitle: `${dashboard.totalUsers ?? 0} registered users`,
    },
    {
      title: "Total Purchases",
      value: dashboard.totalPurchases,
      icon: <FaShoppingCart size={24} />,
      color: "bg-gradient-to-br from-green-500 to-green-600",
      subtitle: "Total purchases made",
    },
    {
      title: "Total Commissions",
      value: dashboard.totalCommissions ?? 0,
      icon: <FaMoneyBillWave size={24} />,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      subtitle: "₹${dashboard.totalCommissions || 0} total commission",
    },
    {
      title: "Pending Commissions",
      value: dashboard.pendingCommissions ?? 0,
      icon: <FaClock size={24} />,
      color: "bg-gradient-to-br from-yellow-500 to-yellow-600",
      subtitle: "Awaiting approval",
    },
    {
      title: "Total Payouts",
      value: dashboard.totalPayouts,
      icon: <FaWallet size={24} />,
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      subtitle: `${dashboard.totalPayouts} payouts processed`,
    },
    {
      title: "Pending Payouts",
      value: dashboard.pendingPayouts ?? 0,
      icon: <MdPending size={24} />,
      color: "bg-gradient-to-br from-red-500 to-red-600",
      subtitle: "Awaiting processing",
    },
  ];

  // Affiliate Cards Configuration
  const affiliateCards = [
    {
      title: "Total Referrals",
      value: dashboard.totalReferrals ?? 0,
      icon: <FaUserFriends size={24} />,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      subtitle: `${dashboard.totalReferrals ?? 0} referrals`,
    },
    {
      title: "My Purchases",
      value: dashboard.totalPurchases,
      icon: <FaShoppingCart size={24} />,
      color: "bg-gradient-to-br from-green-500 to-green-600",
      subtitle: "Purchases made",
    },
    {
      title: "Pending Commission",
      value: `₹${dashboard.pendingCommission}`,
      icon: <FaClock size={24} />,
      color: "bg-gradient-to-br from-yellow-500 to-yellow-600",
      subtitle: "Awaiting approval",
    },
    {
      title: "Approved Commission",
      value: `₹${dashboard.approvedCommission}`,
      icon: <MdApproval size={24} />,
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      subtitle: "Approved and confirmed",
    },
    {
      title: "Paid Commission",
      value: `₹${dashboard.paidCommission}`,
      icon: <FaWallet size={24} />,
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      subtitle: "Successfully paid out",
    },
    {
      title: "Total Earnings",
      value: `₹${dashboard.totalEarnings}`,
      icon: <FaDollarSign size={24} />,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      subtitle: "Lifetime earnings",
    },
    {
      title: "Total Payouts",
      value: dashboard.totalPayouts,
      icon: <FaMoneyBillWave size={24} />,
      color: "bg-gradient-to-br from-pink-500 to-pink-600",
      subtitle: `${dashboard.totalPayouts} payouts received`,
    },
  ];

  const cards = isAdmin ? adminCards : affiliateCards;

  // Welcome message based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Page Header with Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {getGreeting()}! 👋
            </h1>
            <p className="text-gray-500 mt-1">
              Here's what's happening with your affiliate program
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">
                {isAdmin ? "Admin" : "Affiliate"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {cards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </motion.div>

      {/* Quick Actions / Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <FaGift className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Quick Tip</p>
              <p className="text-xs text-gray-500">
                {isAdmin
                  ? "Review pending commissions to keep your affiliates happy"
                  : "Share your referral link to earn more commissions"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <FaTrophy className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Achievement</p>
              <p className="text-xs text-gray-500">
                {isAdmin
                  ? `You're managing ${dashboard.totalUsers || 0} active users`
                  : `You've earned ₹${dashboard.totalEarnings || 0} in commissions`}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <FaChartLine className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Growth</p>
              <p className="text-xs text-gray-500">
                {isAdmin
                  ? `${dashboard.totalPurchases || 0} total purchases recorded`
                  : `${dashboard.totalReferrals || 0} referrals so far`}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;