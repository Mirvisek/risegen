import { prisma } from "@/lib/prisma";
import { Settings, Wrench, Construction, Hammer } from "lucide-react";
import Image from "next/image";

export const metadata = {
    title: "Prace serwisowe | RiseGen",
    description: "Strona jest obecnie w trakcie prac serwisowych.",
    robots: "noindex, nofollow",
};

export default async function MaintenancePage() {
    const config = await prisma.siteConfig.findUnique({
        where: { id: "main" },
    });

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50 animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-100 rounded-full blur-[120px] opacity-50 animate-pulse" />

            <main className="max-w-2xl w-full bg-white/80 backdrop-blur-xl border border-white shadow-2xl rounded-3xl p-8 md:p-12 text-center relative z-10">
                {/* Logo or Brand */}
                {config?.logoUrl ? (
                    <div className="mb-8 flex justify-center">
                        <Image
                            src={config.logoUrl}
                            alt={config.siteName || "RiseGen Logo"}
                            width={180}
                            height={60}
                            className="h-12 w-auto object-contain"
                        />
                    </div>
                ) : (
                    <h1 className="text-3xl font-bold text-indigo-600 mb-8">{config?.siteName || "RiseGen"}</h1>
                )}

                {/* Maintenance Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-2xl mb-8 animate-bounce transition-all duration-1000">
                    <Construction className="w-10 h-10 text-amber-600" />
                </div>

                {/* Content */}
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                    Prace serwisowe w toku
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    {config?.maintenanceMessage ||
                        "Przepraszamy, nasza strona jest obecnie w trakcie planowanych prac serwisowych. Wrócimy do Państwa jak najszybciej!"}
                </p>

                {/* Additional Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    <div className="bg-white border border-neutral-100 p-4 rounded-2xl shadow-sm text-left">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <Settings className="w-5 h-5 text-indigo-500" />
                            </div>
                            <h4 className="font-bold text-gray-800">Aktualizacja systemu</h4>
                        </div>
                        <p className="text-sm text-gray-500">Wdrażamy nowe funkcje i poprawiamy wydajność witryny.</p>
                    </div>
                    <div className="bg-white border border-neutral-100 p-4 rounded-2xl shadow-sm text-left">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-pink-50 rounded-lg">
                                <Hammer className="w-5 h-5 text-pink-500" />
                            </div>
                            <h4 className="font-bold text-gray-800">Optymalizacja</h4>
                        </div>
                        <p className="text-sm text-gray-500">Dbamy o to, aby korzystanie z serwisu było jeszcze prostsze.</p>
                    </div>
                </div>

                {/* Contact or Socials */}
                <div className="border-t border-gray-100 pt-8">
                    <p className="text-sm text-gray-400 mb-4 uppercase tracking-widest font-semibold">
                        Skontaktuj się z nami
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        {config?.email && (
                            <a href={`mailto:${config.email}`} className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                                {config.email}
                            </a>
                        )}
                        {config?.phone && (
                            <a href={`tel:${config.phone.replace(/\s/g, '')}`} className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                                {config.phone}
                            </a>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
