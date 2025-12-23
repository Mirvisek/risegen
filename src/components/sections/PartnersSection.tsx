import { prisma } from "@/lib/prisma";
import Image from "next/image";

export async function PartnersSection() {
    const partners = await prisma.partner.findMany({
        orderBy: { createdAt: "asc" },
    });

    if (partners.length === 0) return null;

    const ngoPartners = partners.filter((p) => p.type === "NGO");
    const businessPartners = partners.filter((p) => p.type === "BUSINESS");
    const otherPartners = partners.filter((p) => p.type === "OTHER");

    return (
        <section className="bg-white dark:bg-gray-950 py-12 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        Nasi Partnerzy
                    </h2>
                    <p className="mt-3 text-lg leading-8 text-gray-600 dark:text-gray-400">
                        Współpracujemy z najlepszymi, aby działać skuteczniej.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* NGO Column */}
                    {ngoPartners.length > 0 && (
                        <div className="flex flex-col items-center space-y-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b-2 border-indigo-500 pb-2">
                                NGO
                            </h3>
                            <div className="grid grid-cols-2 gap-8 w-full place-items-center">
                                {ngoPartners.map((partner) => (
                                    <PartnerLogo key={partner.id} partner={partner} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Business Column */}
                    {businessPartners.length > 0 && (
                        <div className="flex flex-col items-center space-y-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b-2 border-blue-500 pb-2">
                                Partnerzy Biznesowi
                            </h3>
                            <div className="grid grid-cols-2 gap-8 w-full place-items-center">
                                {businessPartners.map((partner) => (
                                    <PartnerLogo key={partner.id} partner={partner} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Other Column */}
                    {otherPartners.length > 0 && (
                        <div className="flex flex-col items-center space-y-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b-2 border-gray-500 pb-2">
                                Inni Partnerzy
                            </h3>
                            <div className="grid grid-cols-2 gap-8 w-full place-items-center">
                                {otherPartners.map((partner) => (
                                    <PartnerLogo key={partner.id} partner={partner} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

function PartnerLogo({ partner }: { partner: any }) {
    return (
        <a
            href={partner.website || "#"}
            target={partner.website ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className={`relative w-32 h-20 transition duration-300 hover:scale-105 flex items-center justify-center ${!partner.website ? "cursor-default pointer-events-none" : ""}`}
            title={partner.name}
        >
            <Image
                src={partner.logo}
                alt={partner.name}
                fill
                className="object-contain p-1"
                sizes="(max-width: 768px) 100px, 150px"
            />
        </a>
    );
}
