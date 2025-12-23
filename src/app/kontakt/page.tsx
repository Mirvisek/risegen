import { Mail, Phone, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ContactForm } from "@/components/ContactForm";

export const metadata = {
    title: "Kontakt - RiseGen",
};

export default async function ContactPage() {
    const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Kontakt</h1>
                <div className="w-20 h-1 bg-indigo-600 mx-auto rounded-full"></div>
                <p className="text-gray-600 dark:text-gray-400">Jesteśmy do Twojej dyspozycji.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex flex-col items-center space-y-3">
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
                        <Mail className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                    {config?.email ? (
                        <a href={`mailto:${config.email}`} className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">{config.email}</a>
                    ) : (
                        <p className="text-gray-400 dark:text-gray-500 italic">Brak adresu email</p>
                    )}
                </div>
                <div className="flex flex-col items-center space-y-3">
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
                        <Phone className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Telefon</h3>
                    {config?.phone ? (
                        <a href={`tel:${config.phone.replace(/\s/g, '')}`} className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">{config.phone}</a>
                    ) : (
                        <p className="text-gray-400 dark:text-gray-500 italic">Brak numeru telefonu</p>
                    )}
                </div>
                <div className="flex flex-col items-center space-y-3">
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
                        <MapPin className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Adres</h3>
                    {config?.orgAddress ? (
                        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{config.orgAddress}</p>
                    ) : (
                        <p className="text-gray-400 dark:text-gray-500 italic">Brak adresu</p>
                    )}
                </div>
            </div>

            <ContactForm
                recaptchaSiteKey={config?.recaptchaSiteKey}
                recaptchaVersion={config?.recaptchaVersion}
            />
        </div>
    );
}
