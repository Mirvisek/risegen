import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProjectGallery } from "@/components/ProjectGallery";
import { AttachmentsList } from "@/components/AttachmentsList";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ShareButtons } from "@/components/ShareButtons";

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const news = await prisma.news.findUnique({
        where: { slug: params.slug },
    });

    if (!news) return { title: "Nie znaleziono" };
    return { title: `${news.title} - Aktualności` };
}

export default async function NewsDetailPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const news = await prisma.news.findUnique({
        where: { slug: params.slug },
    });

    if (!news) notFound();

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl space-y-8">
            <Breadcrumbs
                items={[
                    { label: "Aktualności", href: "/aktualnosci" },
                    { label: news.title }
                ]}
            />

            <Link href="/aktualnosci" className="inline-flex items-center text-gray-500 hover:text-indigo-600 transition">
                <ArrowLeft className="mr-2 h-4 w-4" /> Wróć do aktualności
            </Link>

            <div className="space-y-4">
                <h1 className="text-4xl font-bold text-gray-900">{news.title}</h1>
                <div className="flex gap-2">
                    <span className="text-sm text-gray-500">{new Date(news.createdAt).toLocaleDateString("pl-PL")}</span>
                </div>
            </div>

            {/* Images */}
            {(() => {
                let images: string[] = [];
                try {
                    images = JSON.parse(news.images);
                } catch (e) { }

                return <ProjectGallery images={images} title={news.title} />;
            })()}

            <article className="prose prose-lg max-w-none text-gray-800">
                <div dangerouslySetInnerHTML={{ __html: news.content }} />
            </article>

            <AttachmentsList documents={news.documents} />

            <ShareButtons title={news.title} />
        </div>
    );
}
