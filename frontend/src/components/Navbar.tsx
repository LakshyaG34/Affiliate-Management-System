import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { FaUser, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async (): Promise<void> => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 bg-white sticky top-0 z-50 shadow-sm border-b border-gray-200">
      {/* Left side - Logo & Menu button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="h-9 w-9 grid place-items-center rounded-lg md:hidden hover:bg-gray-100 transition-colors"
          aria-label="Menu"
          title="Menu"
        >
          <FaBars className="w-5 h-5 text-gray-700" />
        </button>
        
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            A
          </div>
          <span className="font-semibold text-lg text-gray-800 hidden sm:block">
            AffiliateMS
          </span>
        </Link>
      </div>

      {/* Right side - User info & logout */}
      <div className="flex items-center gap-4">
        {/* User info */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <FaUser className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </button>

          {/* Dropdown menu */}
          {isUserMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsUserMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-100 sm:hidden">
                  <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Logout button - desktop */}
        <button
          onClick={handleLogout}
          className="hidden sm:flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
        >
          <FaSignOutAlt className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;