import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaDollarSign, 
  FaShoppingCart,
  FaArrowRight,
  FaCheckCircle,
  FaWallet,
  FaGift,
  FaShieldAlt,
  FaChartLine
} from "react-icons/fa";
import { purchaseService } from "@/services/apiService";

const Purchase = () => {
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handlePurchase = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await purchaseService.createPurchase({
        purchaseAmount: Number(purchaseAmount),
      });

      alert(res.data.message);

      setPurchaseAmount("");
    } catch (error: any) {
      alert(error.response?.data?.message || "Purchase failed");
    } finally {
      setLoading(false);
    }
  };

  // Quick amount options
  const quickAmounts = [50, 100, 250, 500, 1000];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Make a Purchase
        </h1>
        <p className="text-gray-500 mt-1">
          Enter the amount you want to purchase
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= MAIN PURCHASE FORM ================= */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300"
          >
            <form onSubmit={handlePurchase} className="space-y-6">
              {/* Amount Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Amount
                </label>
                <div
                  className={`flex items-center border-2 rounded-xl px-4 py-3 transition-all duration-200 ${
                    focusedField === "amount"
                      ? "border-blue-400 ring-4 ring-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <FaDollarSign
                    className={`w-5 h-5 mr-3 transition-colors ${
                      focusedField === "amount" ? "text-blue-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="number"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                    onFocus={() => setFocusedField("amount")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-transparent focus:outline-none text-lg placeholder-gray-400"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                  <span className="text-sm font-medium text-gray-500 ml-2">USD</span>
                </div>
              </div>

              {/* Quick Amount Suggestions */}
              <div>
                <p className="text-sm text-gray-500 mb-3">Quick amounts</p>
                <div className="flex flex-wrap gap-2">
                  {quickAmounts.map((amount) => (
                    <motion.button
                      key={amount}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPurchaseAmount(amount.toString())}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        Number(purchaseAmount) === amount
                          ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                          : "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100"
                      }`}
                    >
                      ${amount}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Purchase Summary */}
              <AnimatePresence>
                {purchaseAmount && Number(purchaseAmount) > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="text-xs text-gray-400">Including all fees</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">
                            ${Number(purchaseAmount).toFixed(2)}
                          </p>
                          <p className="text-xs text-green-600 flex items-center gap-1 justify-end">
                            <FaCheckCircle className="w-3 h-3" />
                            Ready to purchase
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all duration-200 flex items-center justify-center gap-2 ${
                  loading || !purchaseAmount ? "opacity-70 cursor-not-allowed" : ""
                }`}
                type="submit"
                disabled={loading || !purchaseAmount}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FaShoppingCart className="w-5 h-5" />
                    <span>Complete Purchase</span>
                    <FaArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* ================= RIGHT SIDEBAR INFO ================= */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Purchase Benefits */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FaGift className="w-4 h-4 text-blue-600" />
                Benefits
              </h3>
              <div className="space-y-3">
                {[
                  { icon: FaWallet, label: "Earn cashback on every purchase" },
                  { icon: FaShieldAlt, label: "100% secure transactions" },
                  { icon: FaChartLine, label: "Track your purchase history" },
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600">{benefit.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Purchase Stats */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-sm font-semibold text-white/90 mb-4">
                Your Stats
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-blue-200">Total Purchases</p>
                  <p className="text-2xl font-bold">$0.00</p>
                </div>
                <div className="border-t border-white/20 pt-4">
                  <p className="text-xs text-blue-200">Cashback Earned</p>
                  <p className="text-2xl font-bold">$0.00</p>
                </div>
                <div className="border-t border-white/20 pt-4">
                  <p className="text-xs text-blue-200">Pending Rewards</p>
                  <p className="text-2xl font-bold">$0.00</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Purchase;