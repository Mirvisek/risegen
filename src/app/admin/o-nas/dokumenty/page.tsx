import { prisma } from "@/lib/prisma";
import { DocumentForm } from "@/components/admin/DocumentForm";
import { DeleteDocumentButton } from "@/components/admin/DeleteDocumentButton";
import { FileText, Download } from "lucide-react";

export default async function AdminDocumentsPage() {
    const documents = await prisma.document.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-8">
            <DocumentForm />

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900">Lista Dokumentów</h3>
                </div>
                <ul role="list" className="divide-y divide-gray-200">
                    {documents.map((doc) => (
                        <li key={doc.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 flex-shrink-0 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                                    <a
                                        href={doc.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-indigo-600 hover:underline flex items-center gap-1 mt-1"
                                    >
                                        <Download className="h-3 w-3" />
                                        Pobierz PDF
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-gray-400">
                                    {new Date(doc.createdAt).toLocaleDateString("pl-PL")}
                                </span>
                                <DeleteDocumentButton id={doc.id} />
                            </div>
                        </li>
                    ))}
                    {documents.length === 0 && (
                        <li className="px-6 py-8 text-center text-gray-500">Brak dodanych dokumentów.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
