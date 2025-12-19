import { prisma } from "@/lib/prisma";
import { TeamSettingsForm } from "@/components/admin/TeamSettingsForm";


export default async function AdminAboutSettingsPage() {
    const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });

    return (
        <div className="space-y-12 max-w-4xl">
            <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Widoczność sekcji Zespołu</h2>
                <p className="text-gray-500 mb-6 text-sm">
                    Wybierz, które grupy mają być widoczne na publicznej stronie zespołu.
                </p>
                <TeamSettingsForm config={config} />
            </div>
        </div>
    );
}
