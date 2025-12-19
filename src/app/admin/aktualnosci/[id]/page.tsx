import { prisma } from "@/lib/prisma";
import { NewsForm } from "@/components/admin/NewsForm";
import { notFound } from "next/navigation";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const news = await prisma.news.findUnique({
        where: { id },
    });

    if (!news) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Edytuj Aktualność</h1>
            <NewsForm news={news} />
        </div>
    );
}
