import { Link, useNavigate } from "react-router-dom";

import useAuth from "@/hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/dashboard"
          className="text-2xl font-bold text-blue-600"
        >
          AffiliateMS
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-8">
          <Link
            to="/dashboard"
            className="font-medium text-gray-700 transition hover:text-blue-600"
          >
            Dashboard
          </Link>

          <Link
            to="/referrals"
            className="font-medium text-gray-700 transition hover:text-blue-600"
          >
            Referrals
          </Link>

          <Link
            to="/commissions"
            className="font-medium text-gray-700 transition hover:text-blue-600"
          >
            Commissions
          </Link>

          <Link
            to="/payouts"
            className="font-medium text-gray-700 transition hover:text-blue-600"
          >
            Payouts
          </Link>

          {user?.role === "ADMIN" && (
            <Link
              to="/admin"
              className="font-medium text-gray-700 transition hover:text-blue-600"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm text-gray-500">
              {user?.role}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;