import { prisma } from "@/lib/prisma";
import { DocumentList } from "@/components/DocumentList";

export default async function DocumentsPage() {
    const documents = await prisma.document.findMany({
        orderBy: { order: "asc" },
    });

    return (
        <div className="bg-white dark:bg-gray-900 transition-colors">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">Dokumenty</h2>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
                        Przejrzystość to nasza podstawa. Znajdziesz tutaj nasze sprawozdania, statut i inne ważne dokumenty.
                    </p>
                </div>

                <DocumentList initialDocuments={documents} />
            </div>
        </div>
    );
}
