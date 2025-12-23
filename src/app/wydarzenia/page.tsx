import { prisma } from "@/lib/prisma";
import { EventsView } from "@/components/EventsView";
import { notFound } from "next/navigation";

export const metadata = {
    title: "Wydarzenia - RiseGen",
    description: "Sprawdź nadchodzące wydarzenia i spotkania organizowane przez Stowarzyszenie RiseGen.",
};

export default async function EventsPage() {
    const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });

    // If events are disabled globally
    if (config?.showEvents === false) {
        notFound();
    }

    const events = await prisma.event.findMany({
        orderBy: { date: 'desc' }
    });

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-16 transition-colors">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-top-5 duration-700">
                    <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Wydarzenia
                    </h1>
                    <div className="w-24 h-1.5 bg-indigo-600 dark:bg-indigo-500 mx-auto rounded-full"></div>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                        Bądź na bieżąco z naszymi działaniami. Sprawdź kalendarz i dołącz do nas podczas najbliższych spotkań.
                    </p>
                </div>

                <EventsView events={events as any} googleCalendarId={config?.googleCalendarId} />
            </div>
        </div>
    );
}
