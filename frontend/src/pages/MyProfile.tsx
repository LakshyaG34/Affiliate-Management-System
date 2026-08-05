import { FaUser, FaEnvelope, FaShieldAlt, FaCopy, FaLink, FaShare, FaDollarSign, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import useAuth from "@/hooks/useAuth";

const MyProfile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const referralLink = `${window.location.origin}/register?ref=${user.referralCode}`;

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(user.referralCode);

      Swal.fire({
        title: "Copied!",
        text: "Referral code copied to clipboard!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-2xl',
        },
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to copy referral code.",
        icon: "error",
        confirmButtonColor: "#EF4444",
        customClass: {
          popup: 'rounded-2xl',
        },
      });
    }
  };

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);

      Swal.fire({
        title: "Copied!",
        text: "Referral link copied to clipboard!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-2xl',
        },
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to copy referral link.",
        icon: "error",
        confirmButtonColor: "#EF4444",
        customClass: {
          popup: 'rounded-2xl',
        },
      });
    }
  };

  const shareReferralLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join AffiliateMS',
          text: `Join AffiliateMS using my referral link: ${referralLink}`,
          url: referralLink,
        });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // Fallback to copy
      await copyReferralLink();
    }
  };

  // Stats data (mock - replace with actual data from API)
  const stats = {
    totalReferrals: 0,
    totalEarnings: 0,
    pendingCommission: 0,
    joinedDate: user.createdAt || new Date().toISOString(),
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your personal information and referral links
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= MAIN PROFILE ================= */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-white">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-4xl font-bold border-4 border-white/30">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                </div>

                <div>
                  <h1 className="text-3xl font-bold">
                    {user.name}
                  </h1>
                  <p className="text-blue-100 flex items-center gap-2">
                    <span>Affiliate Member</span>
                    <span className="w-1 h-1 bg-blue-200 rounded-full"></span>
                    <span className="text-sm">ID: #{user.id?.slice(0, 8) || 'N/A'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
                  <div className="mb-2 flex items-center gap-2 text-gray-500 text-sm">
                    <FaUser className="w-4 h-4" />
                    Full Name
                  </div>
                  <p className="text-base font-semibold text-gray-800">
                    {user.name}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
                  <div className="mb-2 flex items-center gap-2 text-gray-500 text-sm">
                    <FaEnvelope className="w-4 h-4" />
                    Email Address
                  </div>
                  <p className="text-base font-semibold text-gray-800 break-all">
                    {user.email}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
                  <div className="mb-2 flex items-center gap-2 text-gray-500 text-sm">
                    <FaShieldAlt className="w-4 h-4" />
                    Role
                  </div>
                  <span
                    className={`inline-block rounded-full px-4 py-1.5 text-sm font-semibold ${user.role === "ADMIN"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                      }`}
                  >
                    {user.role}
                  </span>
                </div>

                <div className="rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
                  <div className="mb-2 flex items-center gap-2 text-gray-500 text-sm">
                    <FaCalendarAlt className="w-4 h-4" />
                    Joined
                  </div>
                  <p className="text-base font-semibold text-gray-800">
                    {new Date(stats.joinedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Referral Code */}
              <div className="mt-6 rounded-xl border border-gray-100 p-4">
                <div className="mb-2 text-gray-500 text-sm">
                  Referral Code
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3">
                    <span className="font-mono text-lg font-bold tracking-widest text-blue-600">
                      {user.referralCode}
                    </span>
                  </div>
                  <button
                    onClick={copyReferralCode}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 transition-colors"
                  >
                    <FaCopy className="w-4 h-4" />
                    <span className="hidden sm:inline">Copy</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <div className="lg:col-span-1">
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Stats Summary */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-sm font-semibold text-white/90 mb-4">
                Affiliate Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/20 pb-2">
                  <span className="text-sm text-blue-200">Total Referrals</span>
                  <span className="text-xl font-bold">{stats.totalReferrals}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/20 pb-2">
                  <span className="text-sm text-blue-200">Total Earnings</span>
                  <span className="text-xl font-bold">₹{stats.totalEarnings.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-200">Pending Commission</span>
                  <span className="text-xl font-bold">₹{stats.pendingCommission.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Share Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FaShare className="w-4 h-4 text-blue-600" />
                Share Your Link
              </h3>

              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Your Referral Link</p>
                  <div className="flex items-center gap-2">
                    <FaLink className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <p className="truncate font-mono text-sm text-gray-700">
                      {referralLink}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={copyReferralLink}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 text-sm font-semibold transition-colors"
                  >
                    <FaCopy className="w-4 h-4" />
                    Copy Link
                  </button>
                  <button
                    onClick={shareReferralLink}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-sm font-semibold transition-colors"
                  >
                    <FaShare className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-500 leading-relaxed">
                Share this link with your friends. When they register using
                this link, they'll automatically be associated with your
                referral account and you'll earn commissions.
              </p>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-100 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaDollarSign className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Earn More</p>
                  <p className="text-xs text-gray-500">
                    Share your referral link on social media to earn more commissions.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;