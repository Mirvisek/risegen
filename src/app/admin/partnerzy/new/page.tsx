import { PartnerForm } from "@/components/admin/PartnerForm";

export default function NewPartnerPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dodaj Partnera</h1>
            <PartnerForm />
        </div>
    );
}
