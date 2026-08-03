import { Link, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

interface NavItem {
  path: string;
  label: string;
}

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const navItems: NavItem[] = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/referrals", label: "Referrals" },
    { path: "/commissions", label: "Commissions" },
    { path: "/payouts", label: "Payouts" },
  ];

  if (user?.role === "ADMIN") {
    navItems.push({ path: "/admin", label: "Admin" });
  }

  return (
    <aside className="w-64 min-h-screen bg-white border-r shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-600">AffiliateMS</h2>
      </div>

      <nav className="px-4 py-2">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block px-4 py-2.5 rounded-lg font-medium transition ${
                  isActive(item.path)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;