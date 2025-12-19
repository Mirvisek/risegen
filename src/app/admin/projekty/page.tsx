import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { DeleteProjectButton } from "@/components/admin/DeleteProjectButton";
import { SearchInput } from "@/components/admin/SearchInput";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminProjects(props: { searchParams: Promise<{ q?: string }> }) {
    const session = await getServerSession(authOptions);
    // Projects: SUPERADMIN, ADMIN, REDAKTOR
    if (!session || (!session.user.roles.includes("SUPERADMIN") && !session.user.roles.includes("ADMIN") && !session.user.roles.includes("REDAKTOR"))) {
        redirect("/admin/dashboard");
    }
    const searchParams = await props.searchParams;
    const query = searchParams?.q || "";

    const projects = await prisma.project.findMany({
        where: {
            title: {
                contains: query,
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Projekty</h1>
                <SearchInput placeholder="Szukaj projektu..." />
                <Link href="/admin/projekty/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition shrink-0">
                    <Plus className="h-4 w-4" />
                    Dodaj Projekt
                </Link>
            </div>

            <div className="bg-white shadow sm:rounded-lg border border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-200">
                    {projects.map((project, index) => (
                        <div key={project.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex-1 min-w-0 flex items-center gap-4">
                                <span className="text-gray-400 font-mono text-sm w-6">#{index + 1}</span>
                                <div>
                                    <p className="text-sm font-medium text-indigo-600 truncate">
                                        {project.title}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">{project.slug}</p>
                                </div>
                                {project.isHighlight && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 self-start">Wyróżniony</span>}
                            </div>
                            <div className="flex items-center gap-2">
                                <Link href={`/admin/projekty/${project.id}`} className="p-2 text-gray-400 hover:text-gray-500">
                                    <Edit className="h-5 w-5" />
                                </Link>
                                <DeleteProjectButton projectId={project.id} />
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            {query ? "Nie znaleziono projektów pasujących do wyszukiwania." : "Brak projektów. Dodaj pierwszy!"}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
