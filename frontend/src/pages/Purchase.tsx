import { useState } from "react";
import { purchaseService } from "@/services/auth.service";

const Purchase = () => {
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="mx-auto mt-12 max-w-md rounded-lg bg-white p-6 shadow">
      <h1 className="mb-6 text-2xl font-bold">
        Create Purchase
      </h1>

      <form
        onSubmit={handlePurchase}
        className="space-y-4"
      >
        <div>
          <label className="mb-2 block">
            Purchase Amount
          </label>

          <input
            type="number"
            value={purchaseAmount}
            onChange={(e) =>
              setPurchaseAmount(e.target.value)
            }
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
        >
          {loading ? "Processing..." : "Purchase"}
        </button>
      </form>
    </div>
  );
};

export default Purchase;