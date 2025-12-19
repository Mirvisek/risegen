import { prisma } from "@/lib/prisma";
import { ApplicationForm } from "@/components/ApplicationForm";

export default async function ApplicationPage() {
    const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });

    return (
        <div className="container mx-auto px-4 py-16 max-w-lg space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-gray-900">Zgłoszenie do RiseGen</h1>
                <p className="text-gray-600">
                    Wypełnij formularz, aby dołączyć do naszej społeczności.
                </p>
            </div>

            <ApplicationForm recaptchaSiteKey={config?.recaptchaSiteKey} />
        </div>
    );
}
