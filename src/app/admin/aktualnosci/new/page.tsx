import { NewsForm } from "@/components/admin/NewsForm";

export default function NewNewsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dodaj Aktualność</h1>
            <NewsForm />
        </div>
    );
}
