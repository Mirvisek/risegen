import { prisma } from "@/lib/prisma";
import { PartnerForm } from "@/components/admin/PartnerForm";
import { notFound } from "next/navigation";

export default async function EditPartnerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const partner = await prisma.partner.findUnique({
        where: { id },
    });

    if (!partner) {
        return notFound();
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Edytuj Partnera</h1>
            <PartnerForm partner={partner} />
        </div>
    );
}
