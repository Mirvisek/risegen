import { prisma } from "@/lib/prisma";
import { EventForm } from "@/components/admin/EventForm";
import { notFound } from "next/navigation";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await prisma.event.findUnique({
        where: { id }
    });

    if (!event) notFound();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edytuj Wydarzenie</h1>
            <EventForm event={event} />
        </div>
    );
}
