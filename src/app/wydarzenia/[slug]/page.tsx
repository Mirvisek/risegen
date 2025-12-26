
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import { CalendarDays, MapPin, Download, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { CalendarButtons } from "@/components/CalendarButtons";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProjectGallery } from "@/components/ProjectGallery";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const event = await prisma.event.findUnique({ where: { slug } });
    if (!event) return { title: "Nie znaleziono wydarzenia" };
    return { title: `${event.title} - RiseGen`, description: event.content.substring(0, 160) };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const event = await prisma.event.findUnique({
        where: { slug }
    });

    if (!event) notFound();

    let images = [];
    try {
        images = JSON.parse(event.images);
    } catch (e) {
        console.error("Failed to parse event images", e);
    }

    let documents = [];
    try {
        documents = JSON.parse(event.documents);
    } catch (e) {
        console.error("Failed to parse event documents", e);
    }

    return (
        <div className="bg-white dark:bg-gray-950 transition-colors duration-300 min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-indigo-700 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-purple-800 opacity-90"></div>
                <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                    <CalendarDays size={400} fill="currentColor" />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                    <Link href="/wydarzenia" className="inline-flex items-center text-indigo-200 hover:text-white mb-6 transition">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Wróć do kalendarza
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        {event.title}
                    </h1>
                    <div className="flex flex-wrap justify-center items-center gap-6 text-indigo-100 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        <div className="flex items-center gap-2 bg-indigo-600/50 px-3 py-1 rounded-full backdrop-blur-sm border border-indigo-500/30">
                            <CalendarDays className="w-5 h-5" />
                            <span>{format(new Date(event.date), "d MMMM yyyy", { locale: pl })}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-indigo-600/50 px-3 py-1 rounded-full backdrop-blur-sm border border-indigo-500/30">
                            <Clock className="w-5 h-5" />
                            <span>{format(new Date(event.date), "HH:mm")}</span>
                        </div>
                        {event.location && (
                            <div className="flex items-center gap-2 bg-indigo-600/50 px-3 py-1 rounded-full backdrop-blur-sm border border-indigo-500/30">
                                <MapPin className="w-5 h-5" />
                                <span>{event.location}</span>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8 max-w-4xl -mt-10 relative z-20">
                <div className="mb-6">
                    <Breadcrumbs
                        items={[
                            { label: "Wydarzenia", href: "/wydarzenia" },
                            { label: event.title }
                        ]}
                    />
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 lg:p-12 animate-in slide-in-from-bottom-8 duration-700 delay-300">

                    <div className="flex justify-start mb-8">
                        <CalendarButtons event={event} />
                    </div>

                    {/* Images */}
                    {images.length > 0 && (
                        <div className="mb-10">
                            <ProjectGallery images={images} title={event.title} />
                        </div>
                    )}

                    <div className="prose prose-lg max-w-none text-gray-800 dark:text-gray-300 dark:prose-invert">
                        <ReactMarkdown
                            components={{
                                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4 border-b dark:border-gray-700 pb-2" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-3" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2" {...props} />,
                                p: ({ node, ...props }) => <p className="mb-6 leading-relaxed" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 space-y-2" {...props} />,
                                strong: ({ node, ...props }) => <strong className="font-bold text-indigo-700 dark:text-indigo-400" {...props} />,
                                a: ({ node, ...props }) => <a className="text-indigo-600 dark:text-indigo-400 hover:underline" {...props} />,
                            }}
                        >
                            {event.content}
                        </ReactMarkdown>
                    </div>

                    {documents.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 space-y-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Download className="h-5 w-5" /> Dokumenty do pobrania
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {documents.map((doc: any, i: number) => (
                                    <a
                                        key={i}
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition group shadow-sm text-decoration-none"
                                    >
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-medium text-gray-700 dark:text-gray-300 truncate mr-2">
                                                {doc.name || "Pobierz pliku"}
                                            </span>
                                            <span className="text-xs text-gray-500">Pobierz</span>
                                        </div>
                                        <Download className="h-4 w-4 text-indigo-600 dark:text-indigo-400 transform group-hover:translate-y-0.5 transition-transform shrink-0" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
