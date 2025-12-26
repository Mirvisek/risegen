import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { DonationForm } from "@/components/DonationForm";
import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
    title: "Wspieraj nas | RiseGen",
    description: "Wesprzyj działania Stowarzyszenia RiseGen. Twoja darowizna pomaga nam realizować projekty edukacyjne i społeczne.",
};

export default async function SupportPage() {
    const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });

    if (!config?.enableDonations) {
        return (
            <div className="min-h-screen pt-32 pb-16 px-4 bg-gray-50 dark:bg-black">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-8">
                        <AlertTriangle className="h-12 w-12 text-yellow-600 dark:text-yellow-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Darowizny są tymczasowo wyłączone</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Obecnie nie przyjmujemy darowizn online. Zapraszamy do kontaktu w celu wsparcia w innej formie.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-16 px-4 bg-gray-50 dark:bg-black relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-6 relative inline-block">
                        Wspieraj nasze działania
                        <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full opacity-30"></div>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Twoje wsparcie pozwala nam realizować ambitne projekty edukacyjne, organizować wydarzenia i pomagać młodym talentom się rozwijać.
                        Każda wpłata ma znaczenie!
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-indigo-900/10 p-8 border border-gray-100 dark:border-gray-800">
                    <DonationForm />
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="text-3xl mb-2">🎓</div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Edukacja</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Wspierasz organizację darmowych warsztatów i szkoleń.</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="text-3xl mb-2">💡</div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Innowacje</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Pomagasz tworzyć nowe projekty technologiczne.</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="text-3xl mb-2">🤝</div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Społeczność</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Budujesz silną społeczność młodych liderów.</p>
                    </div>
                </div>

                <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-500">
                    <p>Płatności obsługuje bezpieczny operator płatności Stripe.</p>
                    <p className="mt-1">Stowarzyszenie RiseGen | KRS: 0000XXXXXX | NIP: XXXXXXXXXX</p>
                </div>
            </div>
        </div>
    );
}
