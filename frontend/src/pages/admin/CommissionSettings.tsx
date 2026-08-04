import { useEffect, useState } from "react";
import {
    adminApi,
    type CommissionSettingsData,
} from "@/services/apiService";

const CommissionSettings = () => {
    const [settings, setSettings] =
        useState<CommissionSettingsData | null>(
            null
        );

    const [loading, setLoading] =
        useState(true);

    const fetchSettings = async () => {
        try {
            const res =
                await adminApi.getCommissionSettings();

            setSettings(res.data.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        if (!settings) return;

        await adminApi.updateCommissionSettings({
            commissionPercentage:
                settings.commissionPercentage,
            minimumPayoutAmount:
                settings.minimumPayoutAmount,
        });

        alert("Settings Updated");
    };

    if (loading || !settings)
        return (
            <div className="p-8">
                Loading...
            </div>
        );

    return (
        <div className="mx-auto mt-10 max-w-lg rounded-lg bg-white p-6 shadow">
            <h1 className="mb-6 text-3xl font-bold">
                Commission Settings
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >
                <div>
                    <label className="mb-2 block">
                        Commission Percentage
                    </label>

                    <input
                        type="number"
                        value={
                            settings.commissionPercentage
                        }
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                commissionPercentage:
                                    Number(e.target.value),
                            })
                        }
                        className="w-full rounded border px-3 py-2"
                    />
                </div>

                <div>
                    <label className="mb-2 block">
                        Minimum Payout Amount
                    </label>

                    <input
                        type="number"
                        value={
                            settings.minimumPayoutAmount
                        }
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                minimumPayoutAmount:
                                    Number(e.target.value),
                            })
                        }
                        className="w-full rounded border px-3 py-2"
                    />
                </div>

                <button
                    className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default CommissionSettings;