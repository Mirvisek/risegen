import { prisma } from "@/lib/prisma";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";
import { DeleteTeamMemberButton } from "@/components/admin/DeleteTeamMemberButton";
import Image from "next/image";
import { User, Pencil } from "lucide-react";
import Link from "next/link";

export default async function AdminTeamPage(props: { searchParams: Promise<{ editId?: string; category?: string }> }) {
    const searchParams = await props.searchParams;
    const { editId, category } = searchParams;

    const where = category ? { categories: { contains: category } } : {};

    const members = await prisma.teamMember.findMany({
        where,
        orderBy: [
            { order: "asc" },
        ],
    });

    // We might need to fetch the memberToEdit independently if they aren't in the current filtered list, 
    // but usually user clicks edit from the list, so they are there. 
    // However, for robustness, if editId is set, we might want to fetch that specific member to ensure the form works even if filter changes.
    // Optimization: Just fetch from DB if editId is present and not found in members list?
    // Let's keep it simple: find in list. If not found (because filtered out), maybe fetch separately?
    // Actually simpler: The specific `memberToEdit` logic:
    let memberToEdit = editId ? members.find(m => m.id === editId) : undefined;
    if (editId && !memberToEdit) {
        memberToEdit = await prisma.teamMember.findUnique({ where: { id: editId } }) || undefined;
    }

    const categoryLabels: Record<string, string> = {
        BOARD: "Zarząd",
        OFFICE: "Biuro",
        COORDINATOR: "Koordynatorzy",
        COLLABORATOR: "Współpracownicy",
    };

    const categories = [
        { id: undefined, label: "Wszyscy" },
        { id: "BOARD", label: "Zarząd" },
        { id: "OFFICE", label: "Biuro" },
        { id: "COORDINATOR", label: "Koordynatorzy" },
        { id: "COLLABORATOR", label: "Współpracownicy" },
    ];

    return (
        <div className="space-y-8">
            <TeamMemberForm initialData={memberToEdit} key={memberToEdit?.id || 'new'} />

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-lg font-medium text-gray-900">Lista Członków Zespołu</h3>

                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <Link
                                key={cat.label}
                                href={cat.id ? `?category=${cat.id}` : "?"}
                                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${(!category && !cat.id) || category === cat.id
                                    ? "bg-indigo-100 text-indigo-700"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {cat.label}
                            </Link>
                        ))}
                    </div>
                </div>
                <ul role="list" className="divide-y divide-gray-200">
                    {members.map((member) => (
                        <li key={member.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 relative flex items-center justify-center">
                                    {member.image ? (
                                        <Image src={member.image} alt={member.name} fill className="object-cover" />
                                    ) : (
                                        <User className="h-6 w-6 text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                                    <p className="text-sm text-gray-500">{member.role} <span className="text-xs text-gray-400">• {(() => {
                                        try {
                                            const cats = JSON.parse(member.categories);
                                            return Array.isArray(cats) ? cats.map((c: string) => categoryLabels[c]).join(", ") : "";
                                        } catch (e) { return member.categories }
                                    })()}</span></p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-gray-400">Sort: {member.order}</span>
                                <Link
                                    href={`?editId=${member.id}${category ? `&category=${category}` : ""}`}
                                    className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                                    title="Edytuj"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Link>
                                <DeleteTeamMemberButton id={member.id} />
                            </div>
                        </li>
                    ))}
                    {members.length === 0 && (
                        <li className="px-6 py-8 text-center text-gray-500">Brak członków zespołu w tej kategorii.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
