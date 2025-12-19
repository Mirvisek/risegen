import { prisma } from "@/lib/prisma";
import { TeamList } from "@/components/TeamList";

export const metadata = {
    title: "Zespół | RiseGen",
    description: "Poznaj ludzi tworzących RiseGen. Zarząd, koordynatorzy i współpracownicy.",
};

export default async function TeamPage() {
    const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });
    const members = await prisma.teamMember.findMany({
        orderBy: [
            { order: "asc" },
        ],
    });

    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0 mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Nasz Zespół</h2>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Ludzie z pasją, którzy każdego dnia pracują na rzecz rozwoju regionu.
                    </p>
                </div>

                <TeamList
                    members={members}
                    showBoard={config?.showBoard ?? true}
                    showOffice={config?.showOffice ?? true}
                    showCoordinators={config?.showCoordinators ?? true}
                    showCollaborators={config?.showCollaborators ?? true}
                />
            </div>
        </div>
    );
}
