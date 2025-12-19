import { prisma } from "@/lib/prisma";
import { FileText, Users, Newspaper, Calendar, MessageSquare, MousePointerClick, Download, ShieldCheck } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);
    const isSuperAdmin = session?.user?.roles?.includes("SUPERADMIN");

    const [
        projectCount,
        applicationCount,
        newsCount,
        eventCount,
        messageCount,
        visitCount,
        lastVisits
    ] = await Promise.all([
        prisma.project.count(),
        prisma.application.count(),
        prisma.news.count(),
        prisma.event.count(),
        prisma.contactMessage.count(),
        prisma.visitLog.count(),
        prisma.visitLog.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' }
        })
    ]);

    const stats = [
        { label: "Projekty", value: projectCount, icon: FileText, color: "bg-indigo-100 text-indigo-600" },
        { label: "Zgłoszenia", value: applicationCount, icon: Users, color: "bg-green-100 text-green-600" },
        { label: "Aktualności", value: newsCount, icon: Newspaper, color: "bg-blue-100 text-blue-600" },
        { label: "Wydarzenia", value: eventCount, icon: Calendar, color: "bg-purple-100 text-purple-600" },
        { label: "Wiadomości", value: messageCount, icon: MessageSquare, color: "bg-orange-100 text-orange-600" },
        { label: "Wizyty ogółem", value: visitCount, icon: MousePointerClick, color: "bg-pink-100 text-pink-600" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Pulpit Administratora</h1>

                {isSuperAdmin && (
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-600 flex items-center gap-1 font-semibold">
                            <ShieldCheck className="h-3 w-3" /> SUPERADMIN
                        </span>
                        <a
                            href="/api/admin/backup"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition shadow-sm"
                        >
                            <Download className="h-4 w-4" />
                            Pobierz Kopię Bazy (Backup)
                        </a>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4 transition-all hover:shadow-md">
                        <div className={`p-3 rounded-full ${stat.color}`}>
                            <stat.icon className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Visits Table */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Ostatnie wizyty</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Ścieżka</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Czas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {lastVisits.map((visit) => (
                                    <tr key={visit.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 text-gray-900 truncate max-w-[200px]">{visit.path}</td>
                                        <td className="px-4 py-2 text-gray-600">{new Date(visit.createdAt).toLocaleString('pl-PL')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-indigo-100 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShieldCheck className="h-16 w-16 text-indigo-600" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2 text-gray-900 flex items-center gap-2">
                            <span className="w-2 h-6 bg-indigo-600 rounded-full inline-block"></span>
                            Wskazówka Admina
                        </h3>
                        <p className="text-gray-900 text-sm leading-relaxed font-medium">
                            Możesz teraz pobrać pełną kopię zapasową bazy danych SQLite jednym kliknięciem.
                            Zalecamy robienie tego przed każdą większą aktualizacją treści lub migracji.
                        </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-600 italic relative z-10">
                        System automatycznie rejestruje audyt wszystkich kluczowych zmian w serwisie.
                    </div>
                </div>
            </div>
        </div>
    );
}
