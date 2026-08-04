import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  FaDollarSign,
  FaPercentage,
  FaSave,
  FaEdit,
  FaUndo,
  FaCheckCircle,
  FaWallet,
  FaChartLine,
  FaShieldAlt,
  FaArrowRight,
} from "react-icons/fa";

import {
  adminApi,
  type CommissionSettingsData,
} from "@/services/apiService";

const CommissionSettings = () => {
  const [settings, setSettings] = useState<CommissionSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalSettings, setOriginalSettings] = useState<CommissionSettingsData | null>(null);

  const fetchSettings = async () => {
    try {
      const res = await adminApi.getCommissionSettings();
      const data = res.data.data;
      setSettings(data);
      setOriginalSettings(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Check for changes
  useEffect(() => {
    if (settings && originalSettings) {
      const hasChanged = 
        settings.commissionPercentage !== originalSettings.commissionPercentage ||
        settings.minimumPayoutAmount !== originalSettings.minimumPayoutAmount;
      setHasChanges(hasChanged);
    }
  }, [settings, originalSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!settings) return;

    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Update Commission Settings?",
      html: `
        <div class="text-left">
          <div class="p-4 bg-gray-50 rounded-lg mb-3">
            <p class="flex items-center justify-between mb-2">
              <span class="text-gray-600">Commission Percentage</span>
              <strong class="text-blue-600">${settings.commissionPercentage}%</strong>
            </p>
            <p class="flex items-center justify-between">
              <span class="text-gray-600">Minimum Payout Amount</span>
              <strong class="text-blue-600">₹${settings.minimumPayoutAmount}</strong>
            </p>
          </div>
          <p class="text-sm text-gray-500">This will affect all future commissions.</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3B82F6",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Update Settings",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        confirmButton: 'px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors',
        cancelButton: 'px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors',
        popup: 'rounded-2xl',
        title: 'text-2xl font-bold',
      },
    });

    if (result.isConfirmed) {
      setUpdating(true);

      try {
        await adminApi.updateCommissionSettings({
          commissionPercentage: settings.commissionPercentage,
          minimumPayoutAmount: settings.minimumPayoutAmount,
        });

        // Update original settings to match new settings
        setOriginalSettings(settings);

        Swal.fire({
          title: "Settings Updated!",
          text: "Commission settings have been updated successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-2xl',
          },
        });
      } catch (error: any) {
        Swal.fire({
          title: "Error!",
          text: error.response?.data?.message || "Failed to update settings. Please try again.",
          icon: "error",
          confirmButtonColor: "#EF4444",
          customClass: {
            popup: 'rounded-2xl',
          },
        });
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleReset = () => {
    if (originalSettings) {
      setSettings({ ...originalSettings });
      setHasChanges(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Commission Settings
        </h1>
        <p className="text-gray-500 mt-1">
          Configure commission rates and payout thresholds
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= MAIN FORM ================= */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Commission Percentage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <FaPercentage className="w-4 h-4 text-blue-600" />
                    Commission Percentage
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={settings?.commissionPercentage || 0}
                    onChange={(e) =>
                      setSettings({
                        ...settings!,
                        commissionPercentage: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                    %
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Percentage of each purchase amount that will be paid as commission
                </p>
              </div>

              {/* Minimum Payout Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <FaWallet className="w-4 h-4 text-blue-600" />
                    Minimum Payout Amount
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={settings?.minimumPayoutAmount || 0}
                    onChange={(e) =>
                      setSettings({
                        ...settings!,
                        minimumPayoutAmount: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 px-10 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    min="0"
                    step="0.01"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Minimum amount required before commissions can be paid out
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                <motion.button
                  type="submit"
                  disabled={updating || !hasChanges}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all duration-200 flex items-center justify-center gap-2 ${
                    updating || !hasChanges ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {updating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FaSave className="w-4 h-4" />
                      <span>Save Changes</span>
                      <FaArrowRight className="w-3 h-3" />
                    </>
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleReset}
                  disabled={!hasChanges}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                    !hasChanges ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FaUndo className="w-4 h-4" />
                  <span>Reset Changes</span>
                </motion.button>
              </div>

              {/* Change indicator */}
              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700 flex items-center gap-2"
                >
                  <FaEdit className="w-4 h-4" />
                  <span>You have unsaved changes. Click "Save Changes" to apply.</span>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Current Settings Summary */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-sm font-semibold text-white/90 mb-4">
                Current Settings
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/20 pb-2">
                  <span className="text-sm text-blue-200">Commission Rate</span>
                  <span className="text-xl font-bold">
                    {settings?.commissionPercentage || 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-200">Min. Payout</span>
                  <span className="text-xl font-bold">
                    ₹{settings?.minimumPayoutAmount || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FaShieldAlt className="w-4 h-4 text-blue-600" />
                Quick Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaChartLine className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Commission Rate</p>
                    <p className="text-xs text-gray-500">Higher rates attract more affiliates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaCheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Payout Threshold</p>
                    <p className="text-xs text-gray-500">Minimum amount for payout requests</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tip */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-100 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaDollarSign className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Pro Tip</p>
                  <p className="text-xs text-gray-500">
                    Setting a competitive commission rate can significantly boost your affiliate program's growth.
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

export default CommissionSettings;