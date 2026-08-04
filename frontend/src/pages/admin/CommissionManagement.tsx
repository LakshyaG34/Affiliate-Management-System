import { useEffect, useState } from "react";

import { adminApi, type Commission } from "@/services/auth.service";

const CommissionManagement = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCommissions = async () => {
    try {
      const res = await adminApi.getAllCommissions();
      setCommissions(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    commissionId: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      await adminApi.updateCommissionStatus(
        commissionId,
        status
      );

      fetchCommissions();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCommissions();
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
        Commission Management
      </h1>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">
                Affiliate
              </th>

              <th className="px-6 py-3 text-left">
                Buyer
              </th>

              <th className="px-6 py-3 text-left">
                Purchase
              </th>

              <th className="px-6 py-3 text-left">
                Commission
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
            {commissions.map((commission) => (
              <tr
                key={commission.id}
                className="border-t"
              >
                <td className="px-6 py-4">
                  <div className="font-medium">
                    {commission.affiliate.name}
                  </div>

                  <div className="text-sm text-gray-500">
                    {commission.affiliate.email}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="font-medium">
                    {commission.purchase.user.name}
                  </div>

                  <div className="text-sm text-gray-500">
                    {commission.purchase.user.email}
                  </div>
                </td>

                <td className="px-6 py-4">
                  ₹
                  {commission.purchase.purchaseAmount}
                </td>

                <td className="px-6 py-4">
                  ₹
                  {commission.commissionAmount}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium
                    ${
                      commission.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : commission.status ===
                          "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : commission.status ===
                          "PAID"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {commission.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  {commission.status ===
                  "PENDING" ? (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          handleStatusUpdate(
                            commission.id,
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
                            commission.id,
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

        {commissions.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No commissions found.
          </div>
        )}
      </div>
    </div>
  );
};

export default CommissionManagement;