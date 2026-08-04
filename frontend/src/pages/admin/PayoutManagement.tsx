import { useEffect, useState } from "react";

import {
  payoutApi,
  type Payout,
} from "@/services/apiService";

const PayoutManagement = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayouts = async () => {
    try {
      const res = await payoutApi.getAllPayouts();
      setPayouts(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    payoutId: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      await payoutApi.updatePayoutStatus(
        payoutId,
        status
      );

      fetchPayouts();
    } catch (error) {
      console.error(error);
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
      <h1 className="mb-6 text-3xl font-bold">
        Payout Management
      </h1>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">
                Affiliate
              </th>

              <th className="px-6 py-3 text-left">
                Amount
              </th>

              <th className="px-6 py-3 text-left">
                Status
              </th>

              <th className="px-6 py-3 text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {payouts.map((payout) => (
              <tr
                key={payout.id}
                className="border-t"
              >
                <td className="px-6 py-4">
                  <div className="font-medium">
                    {payout.affiliate.name}
                  </div>

                  <div className="text-sm text-gray-500">
                    {payout.affiliate.email}
                  </div>
                </td>

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

                <td className="px-6 py-4 text-center">
                  {payout.status ===
                  "PENDING" ? (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          handleStatusUpdate(
                            payout.id,
                            "APPROVED"
                          )
                        }
                        className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          handleStatusUpdate(
                            payout.id,
                            "REJECTED"
                          )
                        }
                        className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {payouts.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No payouts found.
          </div>
        )}
      </div>
    </div>
  );
};

export default PayoutManagement;