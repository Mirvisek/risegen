"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { User, Mail, Phone } from "lucide-react";

type TeamMember = {
    id: string;
    name: string;
    role: string;
    bio: string | null;
    image: string | null;
    email: string | null;
    phone: string | null;
    categories: string;
};

interface TeamMemberModalProps {
    member: TeamMember | null;
    isOpen: boolean;
    onClose: () => void;
}

export function TeamMemberModal({ member, isOpen, onClose }: TeamMemberModalProps) {
    if (!member) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl bg-white p-0 overflow-hidden gap-0">
                <div className="grid grid-cols-1 md:grid-cols-5 h-full">
                    <div className="md:col-span-2 bg-gray-100 relative min-h-[250px] md:min-h-full">
                        {member.image ? (
                            <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <User className="h-20 w-20" />
                            </div>
                        )}
                    </div>
                    <div className="md:col-span-3 p-6 md:p-8 flex flex-col h-full">
                        <DialogHeader className="mb-4">
                            <DialogTitle className="text-2xl font-bold text-gray-900">{member.name}</DialogTitle>
                            <p className="text-indigo-600 font-medium">{member.role}</p>
                        </DialogHeader>

                        <div className="flex-grow space-y-4">
                            {member.bio && (
                                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                                    {member.bio}
                                </p>
                            )}
                        </div>

                        {(member.email || member.phone) && (
                            <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
                                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Kontakt</h4>
                                {member.email && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail className="h-4 w-4 text-indigo-500" />
                                        <a href={`mailto:${member.email}`} className="hover:text-indigo-600 hover:underline">
                                            {member.email}
                                        </a>
                                    </div>
                                )}
                                {member.phone && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone className="h-4 w-4 text-indigo-500" />
                                        <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="hover:text-indigo-600 hover:underline">
                                            {member.phone}
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
