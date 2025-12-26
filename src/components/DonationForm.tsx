"use client";

import { useState } from "react";
import { Loader2, Heart, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

const AMOUNTS = [20, 50, 100, 200];

export function DonationForm() {
    const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
    const [customAmount, setCustomAmount] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleAmountSelect = (amount: number) => {
        setSelectedAmount(amount);
        setCustomAmount("");
    };

    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomAmount(e.target.value);
        setSelectedAmount(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const finalAmount = selectedAmount || parseFloat(customAmount);

        try {
            const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: finalAmount }),
            });

            const data = await res.json();

            if (data.url) {
                window.location.href = data.url;
            } else if (data.error) {
                alert(data.error);
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
            alert("Wystąpił błąd połączenia.");
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Wybierz kwotę wsparcia</h2>
                <div className="h-1 w-16 bg-indigo-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {AMOUNTS.map((amount) => (
                    <button
                        key={amount}
                        type="button"
                        onClick={() => handleAmountSelect(amount)}
                        className={`py-4 px-2 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${selectedAmount === amount
                                ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 scale-105 shadow-md"
                                : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
                            }`}
                    >
                        <span className="text-2xl font-bold">{amount} zł</span>
                    </button>
                ))}
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white dark:bg-gray-900 px-2 text-sm text-gray-500">lub wpisz własną kwotę</span>
                </div>
            </div>

            <div className="max-w-xs mx-auto">
                <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-lg font-medium">PLN</span>
                    </div>
                    <input
                        type="number"
                        name="customAmount"
                        id="customAmount"
                        min="5"
                        step="1"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        className={`block w-full rounded-md border-0 py-3 pl-12 pr-12 ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-lg sm:leading-6 ${selectedAmount === null
                                ? "text-indigo-600 ring-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                                : "text-gray-900 dark:text-white ring-gray-300 dark:ring-gray-700 bg-white dark:bg-gray-800"
                            }`}
                        placeholder="Inna kwota"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500 sm:text-sm">.00</span>
                    </div>
                </div>
                {selectedAmount === null && (parseFloat(customAmount) < 5 || !customAmount) && (
                    <p className="mt-2 text-xs text-center text-red-500">Minimalna kwota to 5 PLN</p>
                )}
            </div>

            <div className="pt-4 flex justify-center">
                <button
                    type="submit"
                    disabled={isLoading || (selectedAmount === null && (parseFloat(customAmount) < 5 || !customAmount))}
                    className="w-full md:w-auto min-w-[300px] flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Przetwarzanie...
                        </>
                    ) : (
                        <>
                            <Heart className="h-5 w-5 fill-white/20" />
                            Wpłacam Darowiznę
                        </>
                    )}
                </button>
            </div>

            <div className="flex items-center justify-center gap-4 text-gray-400 grayscale opacity-70 mt-6">
                <div className="flex items-center gap-1"><CreditCard className="h-4 w-4" /> Visa / MasterCard</div>
                <span>•</span>
                <div className="font-semibold">BLIK</div>
                <span>•</span>
                <div className="font-semibold">Przelewy24</div>
            </div>
        </form>
    );
}
