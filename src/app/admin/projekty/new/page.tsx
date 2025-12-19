import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dodaj Projekt</h1>
            <ProjectForm />
        </div>
    );
}
