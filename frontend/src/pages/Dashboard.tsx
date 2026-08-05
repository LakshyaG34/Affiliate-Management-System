import { useEffect, useState } from "react";
import {
  FaUsers,
  FaShoppingCart,
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
  FaWallet,
} from "react-icons/fa";

import {
  dashboardApi,
  type Dashboard,
} from "@/services/apiService";

const Dashboard = () => {
  const [dashboard, setDashboard] =
    useState<Dashboard | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res =
          await dashboardApi.getDashboard();

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
      <div className="flex h-[60vh] items-center justify-center text-xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-8 text-center">
        Failed to load dashboard.
      </div>
    );
  }

  const Card = ({
    title,
    value,
    icon,
    color,
  }: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
  }) => (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>
        </div>

        <div
          className={`rounded-full p-4 text-white ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Welcome back!
        </p>
      </div>

      {dashboard.role === "ADMIN" ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Card
            title="Total Users"
            value={dashboard.totalUsers ?? 0}
            icon={<FaUsers size={26} />}
            color="bg-blue-600"
          />

          <Card
            title="Total Purchases"
            value={dashboard.totalPurchases}
            icon={<FaShoppingCart size={26} />}
            color="bg-green-600"
          />

          <Card
            title="Total Commissions"
            value={dashboard.totalCommissions ?? 0}
            icon={<FaMoneyBillWave size={26} />}
            color="bg-purple-600"
          />

          <Card
            title="Pending Commissions"
            value={
              dashboard.pendingCommissions ?? 0
            }
            icon={<FaClock size={26} />}
            color="bg-yellow-500"
          />

          <Card
            title="Total Payouts"
            value={dashboard.totalPayouts}
            icon={<FaWallet size={26} />}
            color="bg-indigo-600"
          />

          <Card
            title="Pending Payouts"
            value={
              dashboard.pendingPayouts ?? 0
            }
            icon={<FaClock size={26} />}
            color="bg-red-600"
          />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Card
            title="Total Referrals"
            value={
              dashboard.totalReferrals ?? 0
            }
            icon={<FaUsers size={26} />}
            color="bg-blue-600"
          />

          <Card
            title="My Purchases"
            value={dashboard.totalPurchases}
            icon={<FaShoppingCart size={26} />}
            color="bg-green-600"
          />

          <Card
            title="Pending Commission"
            value={`₹${dashboard.pendingCommission}`}
            icon={<FaClock size={26} />}
            color="bg-yellow-500"
          />

          <Card
            title="Approved Commission"
            value={`₹${dashboard.approvedCommission}`}
            icon={<FaCheckCircle size={26} />}
            color="bg-green-500"
          />

          <Card
            title="Paid Commission"
            value={`₹${dashboard.paidCommission}`}
            icon={<FaWallet size={26} />}
            color="bg-indigo-600"
          />

          <Card
            title="Total Earnings"
            value={`₹${dashboard.totalEarnings}`}
            icon={<FaMoneyBillWave size={26} />}
            color="bg-purple-600"
          />

          <Card
            title="Total Payouts"
            value={dashboard.totalPayouts}
            icon={<FaWallet size={26} />}
            color="bg-pink-600"
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;