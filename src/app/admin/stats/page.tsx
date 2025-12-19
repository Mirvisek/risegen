import { prisma } from "@/lib/prisma";
import { StatsManager } from "@/components/admin/StatsManager";

export default async function AdminStatsPage() {
    const stats = await prisma.stat.findMany({
        orderBy: { order: 'asc' }
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Licznik Sukcesów (Statystyki)</h1>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 p-4 rounded-lg text-indigo-800 dark:text-indigo-200 text-sm">
                <p className="font-bold mb-1 italic text-base">Jak to działa?</p>
                <p>Te statystyki są wyświetlane na stronie głównej (jeśli są włączone) w formie efektownego licznika. Możesz tu wpisać np. liczbę projektów, członków lub godzin wolontariatu.</p>
            </div>

            <StatsManager initialStats={stats} />
        </div>
    );
}
