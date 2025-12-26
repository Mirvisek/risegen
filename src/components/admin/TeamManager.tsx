"use client";

import { TeamMemberForm } from "@/components/admin/TeamMemberForm";
import { DeleteTeamMemberButton } from "@/components/admin/DeleteTeamMemberButton";
import Image from "next/image";
import { User, Pencil } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

// Define locally since we can't import type easily from Prisma client in client component sometimes, 
// but we can assume the structure.
type TeamMember = {
    id: string;
    name: string;
    role: string;
    bio: string | null;
    categories: string; // JSON string
    image: string | null;
    email: string | null;
    phone: string | null;
    category?: string; // Deprecated
    order: number;
};

export function TeamManager({ members }: { members: TeamMember[] }) {
    const searchParams = useSearchParams();
    const editId = searchParams.get("editId");
    const categoryFilter = searchParams.get("category");

    const categoryLabels: Record<string, string> = {
        BOARD: "Zarząd",
        OFFICE: "Biuro",
        COORDINATOR: "Koordynatorzy",
        COLLABORATOR: "Współpracownicy",
        // Fallback
    };

    const categories = [
        { id: undefined, label: "Wszyscy" },
        { id: "BOARD", label: "Zarząd" },
        { id: "OFFICE", label: "Biuro" },
        { id: "COORDINATOR", label: "Koordynatorzy" },
        { id: "COLLABORATOR", label: "Współpracownicy" },
    ];

    const [isCreating, setIsCreating] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

    const filteredMembers = categoryFilter
        ? members.filter(m => m.categories.includes(categoryFilter) || m.category === categoryFilter)
        : members;

    const handleCancel = () => {
        setIsCreating(false);
        setEditingMember(null);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-end">
                {!isCreating && !editingMember && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium"
                    >
                        <User className="h-4 w-4" /> Dodaj Osobę
                    </button>
                )}
            </div>

            {(isCreating || editingMember) && (
                <div className="mb-4">
                    <TeamMemberForm
                        initialData={editingMember || undefined}
                        key={editingMember?.id || 'new'}
                        onCancel={handleCancel}
                    />
                </div>
            )}

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Lista Członków Zespołu</h3>

                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <Link
                                key={cat.label}
                                href={cat.id ? `?tab=team&category=${cat.id}` : "?tab=team"}
                                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${(!categoryFilter && !cat.id) || categoryFilter === cat.id
                                    ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    }`}
                            >
                                {cat.label}
                            </Link>
                        ))}
                    </div>
                </div>
                <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-800">
                    {filteredMembers.map((member) => (
                        <li key={member.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 relative flex items-center justify-center border border-gray-200 dark:border-gray-700">
                                    {member.image ? (
                                        <Image src={member.image} alt={member.name} fill className="object-cover" />
                                    ) : (
                                        <User className="h-6 w-6 text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.role} <span className="text-xs text-gray-400 dark:text-gray-500">• {(() => {
                                        try {
                                            const cats = JSON.parse(member.categories);
                                            return Array.isArray(cats) ? cats.map((c: string) => categoryLabels[c] || c).join(", ") : "";
                                        } catch (e) { return member.categories }
                                    })()}</span></p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-gray-400 dark:text-gray-500">Sort: {member.order}</span>
                                <button
                                    onClick={() => {
                                        setEditingMember(member);
                                        setIsCreating(false);
                                        // Scroll to form?
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                    }}
                                    className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    title="Edytuj"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <DeleteTeamMemberButton id={member.id} />
                            </div>
                        </li>
                    ))}
                    {filteredMembers.length === 0 && (
                        <li className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">Brak członków zespołu w tej kategorii.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
