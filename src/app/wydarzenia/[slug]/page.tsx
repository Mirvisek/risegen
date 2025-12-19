import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import { Calendar as CalendarIcon, MapPin, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";

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

    const images = JSON.parse(event.images);
    const documents = JSON.parse(event.documents);

    return (
        <div className="bg-white min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link
                    href="/wydarzenia"
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold mb-8 group transition"
                >
                    <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
                    Powrót do wydarzeń
                </Link>

                <article className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <header className="space-y-4">
                        <div className="flex gap-4 items-center">
                            <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex flex-col items-center">
                                <span className="text-sm uppercase">{format(new Date(event.date), "MMM", { locale: pl })}</span>
                                <span className="text-2xl">{format(new Date(event.date), "dd")}</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                                {event.title}
                            </h1>
                        </div>

                        <div className="flex flex-wrap gap-6 text-gray-600 py-4 border-y border-gray-100">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-5 w-5 text-indigo-500" />
                                <span className="font-medium">{format(new Date(event.date), "EEEE, d MMMM yyyy, HH:mm", { locale: pl })}</span>
                            </div>
                            {event.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-indigo-500" />
                                    <span className="font-medium">{event.location}</span>
                                </div>
                            )}
                        </div>
                    </header>

                    {images.length > 0 && (
                        <div className="aspect-video relative rounded-3xl overflow-hidden shadow-2xl">
                            <img src={images[0]} alt={event.title} className="w-full h-full object-cover" />
                        </div>
                    )}

                    <div className="prose prose-lg max-w-none">
                        <ReactMarkdown
                            components={{
                                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4 border-b pb-2" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-3" {...props} />,
                                p: ({ node, ...props }) => <p className="mb-6 leading-relaxed text-gray-700" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700" {...props} />,
                                strong: ({ node, ...props }) => <strong className="font-bold text-indigo-700" {...props} />,
                            }}
                        >
                            {event.content}
                        </ReactMarkdown>
                    </div>

                    {documents.length > 0 && (
                        <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-100 space-y-4">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Download className="h-5 w-5" /> Dokumenty do pobrania
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {documents.map((doc: any, i: number) => (
                                    <a
                                        key={i}
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-500 transition group shadow-sm"
                                    >
                                        <span className="font-medium text-gray-700 truncate mr-4">
                                            {doc.name || "Pobierz pliku"}
                                        </span>
                                        <Download className="h-4 w-4 text-indigo-600 transform group-hover:translate-y-0.5 transition-transform" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </article>
            </div>
        </div>
    );
}
