import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProjectGallery } from "@/components/ProjectGallery";
import { AttachmentsList } from "@/components/AttachmentsList";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ShareButtons } from "@/components/ShareButtons";
import ReactMarkdown from "react-markdown";

export default async function ProjectPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const project = await prisma.project.findUnique({
        where: { slug: params.slug },
    });

    if (!project) notFound();

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl space-y-8">
            <Breadcrumbs
                items={[
                    { label: "Projekty", href: "/projekty" },
                    { label: project.title }
                ]}
            />

            <Link href="/projekty" className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                <ArrowLeft className="mr-2 h-4 w-4" /> Wróć do listy
            </Link>

            <div className="space-y-4">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
                <div className="flex gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(project.createdAt).toLocaleDateString("pl-PL")}</span>
                </div>
            </div>

            {/* Images */}
            {(() => {
                let images: string[] = [];
                try {
                    images = JSON.parse(project.images);
                } catch (e) { }

                return <ProjectGallery images={images} title={project.title} />;
            })()}

            <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-300 dark:prose-invert">
                <ReactMarkdown
                    components={{
                        h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-3" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                        li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900 dark:text-white" {...props} />,
                        a: ({ node, ...props }) => <a className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline" {...props} />,
                        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic my-4" {...props} />,
                    }}
                >
                    {project.content}
                </ReactMarkdown>
            </article>

            <AttachmentsList documents={project.documents} />

            <ShareButtons title={project.title} />
        </div>
    );
}
