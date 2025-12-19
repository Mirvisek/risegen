import { prisma } from "@/lib/prisma";
import { ProjectList } from "@/components/ProjectList";

export const metadata = {
    title: "Projekty - RiseGen",
};

export default async function ProjectsPage() {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="container mx-auto px-4 py-16 max-w-6xl space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-gray-900">Wszystkie Projekty</h1>
                <div className="w-20 h-1 bg-indigo-600 mx-auto rounded-full"></div>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Zobacz, co udało nam się zrealizować i nad czym obecnie pracujemy.
                </p>
            </div>

            <ProjectList projects={projects} />
        </div>
    );
}
