import { prisma } from "@/lib/prisma";
import { StatsManager } from "@/components/admin/StatsManager";

export default async function AdminStatsPage() {
    const stats = await prisma.stat.findMany({
        orderBy: { order: 'asc' }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Licznik Sukcesów ({stats.length})</h1>
            </div>

            <div className="bg-white shadow sm:rounded-lg border border-gray-200 p-6">
                <p className="font-bold text-gray-900 mb-2">Jak to działa?</p>
                <p className="text-sm text-gray-600">Te statystyki są wyświetlane na stronie głównej (jeśli są włączone) w formie efektownego licznika. Możesz tu wpisać np. liczbę projektów, członków lub godzin wolontariatu.</p>
            </div>

            <StatsManager initialStats={stats} />
        </div>
    );
}
