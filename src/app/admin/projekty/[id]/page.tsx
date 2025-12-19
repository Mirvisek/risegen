
import { ProjectForm } from "@/components/admin/ProjectForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditProjectPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const project = await prisma.project.findUnique({
        where: { id: params.id },
    });

    if (!project) notFound();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Edytuj Projekt</h1>
            <ProjectForm project={project} />
        </div>
    );
}
