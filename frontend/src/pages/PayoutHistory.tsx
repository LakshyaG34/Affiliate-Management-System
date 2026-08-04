import { useEffect, useState } from "react";

import {
  payoutApi,
  type Payout,
} from "@/services/apiService";

const PayoutHistory = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayouts = async () => {
    try {
      const res = await payoutApi.getMyPayouts();
      setPayouts(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async () => {
    try {
      await payoutApi.requestPayout();
      fetchPayouts();
      alert("Payout requested successfully");
    } catch (error: any) {
      alert(
        error.response?.data?.message ??
          "Failed to request payout"
      );
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          My Payouts
        </h1>

        <button
          onClick={handleRequestPayout}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Request Payout
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">
                Amount
              </th>

              <th className="px-6 py-3 text-left">
                Status
              </th>

              <th className="px-6 py-3 text-left">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {payouts.map((payout) => (
              <tr
                key={payout.id}
                className="border-t"
              >
                <td className="px-6 py-4 font-semibold">
                  ₹{payout.payoutAmount}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium
                    ${
                      payout.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : payout.status ===
                          "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {payout.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {new Date(
                    payout.createdAt
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {payouts.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No payout history found.
          </div>
        )}
      </div>
    </div>
  );
};

export default PayoutHistory;