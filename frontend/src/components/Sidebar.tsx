import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import useAuth from "@/hooks/useAuth";
import {
  FaHome,
  FaShoppingCart,
  FaUsers,
  FaDollarSign,
  FaCreditCard,
  FaUserCog,
  FaChevronRight,
} from "react-icons/fa";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  // Define navigation sections with icons
  const sections: NavSection[] = useMemo(() => {
    const baseSections: NavSection[] = [
      {
        label: "Main",
        items: [
          {
            path: "/dashboard",
            label: "Dashboard",
            icon: <FaHome className="w-5 h-5" />,
          },
          {
            path: "/purchase",
            label: "Purchase",
            icon: <FaShoppingCart className="w-5 h-5" />,
          },
        ],
      },
      {
        label: "Management",
        items: [
          {
            path: "/referrals",
            label: "Referrals",
            icon: <FaUsers className="w-5 h-5" />,
          },
          {
            path: "/my-commissions",
            label: "Commissions",
            icon: <FaDollarSign className="w-5 h-5" />,
          },
          {
            path: "/payouts-history",
            label: "Payouts",
            icon: <FaCreditCard className="w-5 h-5" />,
          },
        ],
      },
    ];

    // Add Admin section if user is admin
    if (user?.role === "ADMIN") {
      baseSections.push({
        label: "Admin",
        items: [
          {
            path: "/admin",
            label: "Admin Panel",
            icon: <FaUserCog className="w-5 h-5" />,
          },
          {
            path: "/admin/commissions",
            label: "Commission Management",
            icon: <FaDollarSign className="w-5 h-5" />,
          },
          {
            path: "/admin/payouts",
            label: "Payout Management",
            icon: <FaCreditCard className="w-5 h-5" />,
          },
          {
            path: "/admin/commission-settings",
            label: "Commission Settings",
            icon: <FaUserCog className="w-5 h-5" />,
          }
        ],
      });
    }

    return baseSections;
  }, [user?.role]);

  // Auto-expand sections based on active path
  useEffect(() => {
    const activeSection = sections.find((section) =>
      section.items.some((item) => location.pathname.startsWith(item.path))
    );
    if (activeSection && !openGroups.has(activeSection.label)) {
      setOpenGroups((prev) => {
        const next = new Set(prev);
        next.add(activeSection.label);
        return next;
      });
    }
  }, [location.pathname, sections]);

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const linkBase =
    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 w-full overflow-hidden";
  const linkActive = "bg-blue-600 text-white shadow-md shadow-blue-200";
  const linkIdle =
    "text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm";
  const bullet =
    "absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-blue-600";

  const SectionHeader = ({
    label,
    expanded,
  }: {
    label: string;
    expanded: boolean;
  }) => (
    <button
      type="button"
      onClick={() => toggleGroup(label)}
      aria-expanded={expanded}
      className="flex w-full items-center justify-between px-3 py-2 mt-2
               text-xs font-semibold tracking-wider text-gray-500
               hover:text-blue-600 transition-colors uppercase"
    >
      <span>{label}</span>
      <motion.span
        animate={{ rotate: expanded ? 90 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <FaChevronRight className="w-3.5 h-3.5" />
      </motion.span>
    </button>
  );

  const NavItem = ({ path, label, icon }: NavItem) => {
    const isActivePath = isActive(path);
    
    return (
      <Link
        to={path}
        className={`${linkBase} ${
          isActivePath ? linkActive : linkIdle
        }`}
      >
        <span
          className={`${
            isActivePath ? bullet : "hidden"
          } md:block`}
        />
        <span className="flex-shrink-0">{icon}</span>
        <span className="truncate">{label}</span>
      </Link>
    );
  };

  return (
    <aside
      className="w-64 min-h-screen bg-white overflow-y-auto"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#CBD5E0 #F7FAFC",
      }}
    >

      {/* Navigation */}
      <nav className="p-4">
        {sections.length === 0 ? (
          <div className="text-sm text-gray-500 px-3 py-2">
            No menu available for your role.
          </div>
        ) : (
          <div className="space-y-4">
            {sections.map((section) => {
              // Main section (no collapse)
              if (section.label === "Main") {
                return (
                  <div key={section.label}>
                    <div className="px-3 mb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      {section.label}
                    </div>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <NavItem key={item.path} {...item} />
                      ))}
                    </div>
                  </div>
                );
              }

              // Collapsible sections
              const expanded = openGroups.has(section.label);
              return (
                <div key={section.label}>
                  <SectionHeader label={section.label} expanded={expanded} />
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden space-y-1"
                      >
                        {section.items.map((item) => (
                          <NavItem key={item.path} {...item} />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </nav>

      {/* Gradient fade at bottom */}
      <div className="sticky bottom-0 h-10 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
    </aside>
  );
};

export default Sidebar;