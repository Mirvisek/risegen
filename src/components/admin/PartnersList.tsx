"use client";

import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import Image from "next/image";
import { DeletePartnerButton } from "@/components/admin/DeletePartnerButton";

interface Partner {
    id: string;
    logo: string;
    name: string;
    type: string;
    website: string | null;
}

const typeLabels: Record<string, string> = {
    NGO: "Organizacje Pozarządowe",
    BUSINESS: "Biznes",
    OTHER: "Inni",
};

export function PartnersList({ partners }: { partners: Partner[] }) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Partnerzy Stowarzyszenia</h2>
                <Link
                    href="/admin/partnerzy/new"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Dodaj Partnera
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                                Logo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nazwa
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kategoria
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                WWW
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Akcje
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {partners.map((partner) => (
                            <tr key={partner.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="h-10 w-16 relative">
                                        <Image
                                            src={partner.logo}
                                            alt={partner.name}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {partner.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {typeLabels[partner.type] || partner.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {partner.website ? (
                                        <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline truncate max-w-[150px] block">
                                            {partner.website}
                                        </a>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2 items-center h-full">
                                    <Link
                                        href={`/admin/partnerzy/${partner.id}`}
                                        className="text-indigo-600 hover:text-indigo-900 p-1"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                    <DeletePartnerButton id={partner.id} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {partners.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        Brak partnerów. Dodaj pierwszego!
                    </div>
                )}
            </div>
        </div>
    );
}
