
"use client";

import { useState } from "react";
import { Loader2, Heart } from "lucide-react";
import { toast } from "sonner";
import { processDonationAction } from "@/app/wesprzyj-nas/actions";

export function DonationWidget() {
    const [amount, setAmount] = useState<string>("50");
    const [customAmount, setCustomAmount] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const PRESETS = [20, 50, 100, 200];

    const handleAmountSelect = (val: number) => {
        setAmount(val.toString());
        setCustomAmount("");
    };

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomAmount(e.target.value);
        setAmount("");
    };

    const getFinalAmount = () => {
        if (customAmount) return parseFloat(customAmount.replace(",", "."));
        return parseFloat(amount);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const val = getFinalAmount();

        if (!val || isNaN(val) || val <= 0) {
            toast.error("Wpisz poprawną kwotę.");
            return;
        }

        if (!email || !email.includes("@")) {
            toast.error("Wpisz poprawny adres e-mail.");
            return;
        }

        setLoading(true);

        const amountInGrosze = Math.round(val * 100);

        try {
            const result = await processDonationAction(amountInGrosze, email);
            if (result.success && result.paymentUrl) {
                window.location.href = result.paymentUrl;
            } else {
                toast.error(result.message || "Błąd inicjacji płatności.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Wystąpił błąd połączenia.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border-2 border-indigo-100 dark:border-indigo-900/50 p-8 lg:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                    <Heart size={32} fill="currentColor" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Wpłać on-line</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Szybki i bezpieczny przelew</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                {/* Kwota */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Wybierz kwotę wsparcia</label>
                    <div className="grid grid-cols-4 gap-2 mb-3">
                        {PRESETS.map((val) => (
                            <button
                                key={val}
                                type="button"
                                onClick={() => handleAmountSelect(val)}
                                className={`py-2 px-1 rounded-lg text-sm font-bold border transition
                                    ${amount === val.toString()
                                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105"
                                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700"
                                    }`}
                            >
                                {val} zł
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <input
                            type="number"
                            placeholder="Inna kwota"
                            value={customAmount}
                            onChange={handleCustomChange}
                            min="1"
                            step="0.01"
                            className={`block w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 pr-12 transition ${customAmount ? "border-indigo-500 ring-1 ring-indigo-500" : ""}`}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">PLN</span>
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twój adres e-mail</label>
                    <input
                        type="email"
                        id="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jan@kowalski.pl"
                        className="block w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3"
                    />
                    <p className="text-xs text-gray-500 mt-1">Potrzebny do potwierdzenia wpłaty.</p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 group"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Przetwarzanie...
                        </>
                    ) : (
                        <>
                            Przejdź do płatności
                            <Heart size={18} fill="currentColor" className="opacity-80 group-hover:scale-110 transition-transform" />
                        </>
                    )}
                </button>

                <div className="flex justify-center items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
                    <span className="text-xs text-gray-400 font-medium">Bezpieczne płatności przez</span>
                    {/* Text fallback if no logo */}
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Przelewy24</span>
                </div>
            </form>
        </div>
    );
}
