import { EventForm } from "@/components/admin/EventForm";

export default function NewEventPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nowe Wydarzenie</h1>
            <EventForm />
        </div>
    );
}
