"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram } from "lucide-react";

interface FooterProps {
    config?: {
        orgName?: string | null;
        orgAddress?: string | null;
        orgNip?: string | null;
        orgRegon?: string | null;
        orgBankAccount?: string | null;
        email?: string | null;
        phone?: string | null;
        facebookUrl?: string | null;
        instagramUrl?: string | null;
        tiktokUrl?: string | null;
        footerDocuments?: string | null;
    } | null;
}

function PhoneNumber({ phone }: { phone: string }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return <span>{phone}</span>;
    }

    return (
        <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-indigo-600 transition">
            {phone}
        </a>
    );
}

export default function Footer({ config }: FooterProps) {
    const pathname = usePathname();

    // Hide footer on admin and auth pages
    if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
        return null;
    }

    return (
        <footer className="bg-gray-50 border-t border-gray-100 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">

                    {/* LEFT: Copyright */}
                    <div className="text-sm text-gray-500 order-3 md:order-1 whitespace-nowrap">
                        &copy; {new Date().getFullYear()} Stowarzyszenie RiseGen
                    </div>

                    {/* CENTER: Organization Details */}
                    {config && (
                        <div className="flex flex-col items-center text-center text-xs text-gray-500 space-y-1 order-1 md:order-2">
                            {config.orgName && <p className="font-semibold text-gray-900">{config.orgName}</p>}

                            <div className="flex flex-col items-center gap-1">
                                {config.orgAddress && <span>{config.orgAddress}</span>}
                                {config.orgNip && <span>NIP: {config.orgNip}</span>}
                                {config.orgRegon && <span>REGON: {config.orgRegon}</span>}
                            </div>

                            <div className="flex flex-col items-center gap-1 pt-1">
                                {config.email && <a href={`mailto:${config.email}`} className="hover:text-indigo-600 transition">{config.email}</a>}
                                {config.phone && (
                                    <PhoneNumber phone={config.phone} />
                                )}
                            </div>

                            {config.orgBankAccount && (
                                <div className="text-gray-500 font-medium pt-1">
                                    Numer konta: {config.orgBankAccount}
                                </div>
                            )}
                        </div>
                    )}

                    {/* RIGHT: Social Media */}
                    <div className="flex gap-4 order-2 md:order-3">
                        {config?.facebookUrl && (
                            <Link href={config.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 transition">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                        )}
                        {config?.instagramUrl && (
                            <Link href={config.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                        )}
                        {config?.tiktokUrl && (
                            <Link href={config.tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="h-5 w-5"
                                >
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                                <span className="sr-only">TikTok</span>
                            </Link>
                        )}
                    </div>

                </div>

                {/* BOTTOM: Footer Documents */}
                <div className="border-t border-gray-100 mt-8 pt-8 flex flex-wrap justify-center gap-6 text-xs text-gray-500">
                    {/* Always show Accessibility Declaration */}
                    <Link
                        href="/deklaracja-dostepnosci"
                        className="hover:text-indigo-600 transition underline decoration-gray-300 underline-offset-4"
                    >
                        Deklaracja Dostępności
                    </Link>

                    {/* Always show Privacy Policy */}
                    <Link
                        href="/polityka-prywatnosci"
                        className="hover:text-indigo-600 transition underline decoration-gray-300 underline-offset-4"
                    >
                        Polityka Prywatności
                    </Link>

                    {/* Always show Cookie Policy */}
                    <Link
                        href="/polityka-cookies"
                        className="hover:text-indigo-600 transition underline decoration-gray-300 underline-offset-4"
                    >
                        Polityka Cookies
                    </Link>

                    {/* Additional documents from config */}
                    {config?.footerDocuments && (() => {
                        try {
                            const docs = JSON.parse(config.footerDocuments);
                            return Array.isArray(docs) ? docs.map((doc: any, i: number) => (
                                <a
                                    key={i}
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-indigo-600 transition underline decoration-gray-300 underline-offset-4"
                                >
                                    {doc.name}
                                </a>
                            )) : null;
                        } catch (e) {
                            return null;
                        }
                    })()}
                </div>
            </div>
        </footer>
    );
}
