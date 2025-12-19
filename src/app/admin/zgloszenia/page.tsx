import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SearchInput } from "@/components/admin/SearchInput";
import Link from "next/link";
import { cn } from "@/lib/utils";

const FILTERS = [
    { label: "Wszystkie", value: undefined },
    { label: "Nowe", value: "NEW" },
    { label: "Zapoznane", value: "READ" },
    { label: "W realizacji", value: "IN_PROGRESS" },
    { label: "Zakończone", value: "DONE" },
    { label: "Usunięte", value: "DELETED" },
];

export default async function AdminApplications(props: { searchParams: Promise<{ q?: string; status?: string }> }) {
    const searchParams = await props.searchParams;
    const session = await getServerSession(authOptions);
    // User request states:
    // Admin ma dostęp do wszystkiego oprócz ustawień.
    // Rekruter tylko do zgłoszeń.
    // SuperAdmin do wszystkiego.
    // So: SUPERADMIN, ADMIN, REKRUTER
    if (!session || (!session.user.roles.includes("SUPERADMIN") && !session.user.roles.includes("ADMIN") && !session.user.roles.includes("REKRUTER"))) {
        redirect("/admin/dashboard");
    }

    const query = searchParams?.q || "";
    const statusFilter = searchParams?.status;

    const where: any = {};

    // Default: exclude DELETED unless explicitly filtering for it
    if (statusFilter) {
        where.status = statusFilter;
    } else {
        where.status = { not: "DELETED" };
    }

    if (query) {
        const num = parseInt(query);
        if (!isNaN(num)) {
            where.OR = [
                { number: num },
                { firstName: { contains: query } },
                { lastName: { contains: query } },
                { email: { contains: query } },
            ];
        } else {
            where.OR = [
                { firstName: { contains: query } },
                { lastName: { contains: query } },
                { email: { contains: query } },
            ];
        }
    }

    const applications = await prisma.application.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Zgłoszenia ({applications.length})</h1>
                <SearchInput placeholder="Szukaj (nr, imię, email)..." />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 pb-2">
                {FILTERS.map((filter) => {
                    const isActive = statusFilter === filter.value;
                    return (
                        <Link
                            key={filter.label}
                            href={filter.value ? `?status=${filter.value}` : "/admin/zgloszenia"}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                                isActive
                                    ? "bg-indigo-100 text-indigo-800 border-indigo-200"
                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            )}
                        >
                            {filter.label}
                        </Link>
                    );
                })}
            </div>

            <div className="overflow-hidden bg-white shadow sm:rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Imię i Nazwisko</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Typ</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Kontakt</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Opis</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-32">Status</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-32">Data</th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span className="sr-only">Podgląd</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {applications.map((app) => (
                            <tr key={app.id} className="hover:bg-gray-50">
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono font-bold text-gray-400">#{app.number}</span>
                                        <span>{app.firstName} {app.lastName}</span>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                                    {app.type === 'MEMBER' ? (
                                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Członek</span>
                                    ) : app.type === 'VOLUNTEER' ? (
                                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Wolontariusz</span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    <div className="flex flex-col">
                                        <span>{app.email}</span>
                                        <span className="text-xs">{app.phone}</span>
                                    </div>
                                </td>
                                <td className="px-3 py-4 text-sm text-gray-500 max-w-xs break-words">
                                    {app.description}
                                </td>
                                <td className="px-3 py-4 text-sm">
                                    <span className={cn(
                                        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                                        app.status === 'NEW' ? "bg-blue-50 text-blue-700 ring-blue-600/10" :
                                            app.status === 'READ' ? "bg-yellow-50 text-yellow-800 ring-yellow-600/20" :
                                                app.status === 'IN_PROGRESS' ? "bg-purple-50 text-purple-700 ring-purple-600/10" :
                                                    app.status === 'DONE' ? "bg-green-50 text-green-700 ring-green-600/20" :
                                                        "bg-red-50 text-red-700 ring-red-600/20" // DELETED
                                    )}>
                                        {FILTERS.find(f => f.value === app.status)?.label || app.status}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {new Date(app.createdAt).toLocaleDateString("pl-PL")}
                                </td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    <Link href={`/admin/zgloszenia/${app.id}`} className="text-indigo-600 hover:text-indigo-900">
                                        Podgląd
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {applications.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">
                                    {query || statusFilter ? "Nie znaleziono zgłoszeń spełniających kryteria." : "Brak zgłoszeń."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
