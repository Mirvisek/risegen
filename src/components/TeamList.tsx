"use client";

import { useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";
import { TeamMemberModal } from "@/components/TeamMemberModal";
import { motion } from "framer-motion";

type TeamMember = {
    id: string;
    name: string;
    role: string;
    bio: string | null;
    image: string | null;
    categories: string;
    email: string | null;
    phone: string | null;
    order: number;
    category?: string; // Deprecated
    alignment?: string;
};

interface TeamListProps {
    members: TeamMember[];
    showBoard: boolean;
    showOffice: boolean;
    showCoordinators: boolean;
    showCollaborators: boolean;
}

export function TeamList({ members, showBoard, showOffice, showCoordinators, showCollaborators }: TeamListProps) {
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

    // Grouping Logic
    const boardMembers = members.filter(m => m.categories.includes("BOARD") || m.category === "BOARD");
    const officeMembers = members.filter(m => m.categories.includes("OFFICE") || m.category === "OFFICE");
    const coordinators = members.filter(m => m.categories.includes("COORDINATOR") || m.category === "COORDINATOR");
    const collaborators = members.filter(m => m.categories.includes("COLLABORATOR") || m.category === "COLLABORATOR");

    function MemberCard({ member }: { member: TeamMember }) {
        return (
            <div
                onClick={() => setSelectedMember(member)}
                className="group relative flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50"
            >
                <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 ring-4 ring-white dark:ring-gray-800 shadow-lg group-hover:ring-indigo-50 dark:group-hover:ring-indigo-900/30 transition-all">
                    {member.image ? (
                        <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className={`object-cover transition-transform duration-500 group-hover:scale-110 ${member.alignment === "top" ? "object-top" : member.alignment === "bottom" ? "object-bottom" : "object-center"}`}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                            <User className="w-12 h-12" />
                        </div>
                    )}
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{member.name}</h3>
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-2">{member.role}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        Kliknij, aby zobaczyć więcej
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-16">
            <TeamMemberModal
                member={selectedMember}
                isOpen={!!selectedMember}
                onClose={() => setSelectedMember(null)}
            />

            {showBoard && boardMembers.length > 0 && (
                <section>
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Zarząd</h2>
                        <div className="w-12 h-1 bg-indigo-600 dark:bg-indigo-500 mx-auto rounded-full mt-3"></div>
                    </div>
                    <div className="flex flex-wrap gap-8 justify-center">
                        {boardMembers.map((member, i) => (
                            <motion.div
                                key={member.id}
                                className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <MemberCard member={member} />
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {showOffice && officeMembers.length > 0 && (
                <section>
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Biuro</h2>
                        <div className="w-12 h-1 bg-indigo-600 dark:bg-indigo-500 mx-auto rounded-full mt-3"></div>
                    </div>
                    <div className="flex flex-wrap gap-8 justify-center">
                        {officeMembers.map((member, i) => (
                            <motion.div
                                key={member.id}
                                className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <MemberCard member={member} />
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {showCoordinators && coordinators.length > 0 && (
                <section>
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Koordynatorzy</h2>
                        <div className="w-12 h-1 bg-indigo-600 dark:bg-indigo-500 mx-auto rounded-full mt-3"></div>
                    </div>
                    <div className="flex flex-wrap gap-8 justify-center">
                        {coordinators.map((member, i) => (
                            <motion.div
                                key={member.id}
                                className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <MemberCard member={member} />
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {showCollaborators && collaborators.length > 0 && (
                <section>
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Współpracownicy</h2>
                        <div className="w-12 h-1 bg-indigo-600 dark:bg-indigo-500 mx-auto rounded-full mt-3"></div>
                    </div>
                    <div className="flex flex-wrap gap-8 justify-center">
                        {collaborators.map((member, i) => (
                            <motion.div
                                key={member.id}
                                className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <MemberCard member={member} />
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
