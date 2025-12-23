import { prisma } from "@/lib/prisma";
import { Mail, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata = {
    title: "Deklaracja Dostępności",
    description: "Deklaracja dostępności cyfrowej zgodnie z ustawą z dnia 4 kwietnia 2019 r.",
};

export default async function DeklaracjaDostepnosciPage() {
    const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <Breadcrumbs items={[{ label: "Deklaracja Dostępności" }]} />

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 space-y-8 transition-colors">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Deklaracja Dostępności</h1>
                    <div className="w-20 h-1 bg-indigo-600 mx-auto rounded-full"></div>
                </div>

                <section className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
                    <p className="text-gray-600 leading-relaxed">
                        <strong>{config?.orgName || "Stowarzyszenie RiseGen"}</strong> zobowiązuje się
                        zapewnić dostępność swojej strony internetowej zgodnie z ustawą z dnia 4 kwietnia 2019 r.
                        o dostępności cyfrowej stron internetowych i aplikacji mobilnych podmiotów publicznych.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Data publikacji i aktualizacji</h2>
                    <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                        <li><strong>Data publikacji strony internetowej:</strong> 2024</li>
                        <li><strong>Data ostatniej istotnej aktualizacji:</strong> {new Date().toLocaleDateString('pl-PL')}</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Status zgodności z ustawą</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Strona internetowa jest <strong>częściowo zgodna</strong> z ustawą o dostępności cyfrowej
                        z powodu niezgodności lub wyłączeń wymienionych poniżej.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Treści niedostępne</h3>
                    <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                        <li>Niektóre materiały wideo mogą nie posiadać napisów lub audiodeskrypcji</li>
                        <li>Dokumenty PDF publikowane przed wdrożeniem standardów dostępności</li>
                        <li>Niektóre treści osadzone z serwisów zewnętrznych (Facebook, Instagram)</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Przygotowanie deklaracji dostępności</h2>
                    <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                        <li><strong>Data sporządzenia deklaracji:</strong> {new Date().toLocaleDateString('pl-PL')}</li>
                        <li><strong>Metoda przygotowania deklaracji:</strong> Samoocena</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Informacje zwrotne i dane kontaktowe</h2>
                    <p className="text-gray-600 leading-relaxed">
                        W przypadku problemów z dostępnością strony internetowej prosimy o kontakt.
                        Osobą odpowiedzialną jest {config?.orgName || "Administrator strony"}.
                        Kontakt jest możliwy poprzez:
                    </p>

                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 my-6">
                        <div className="space-y-3">
                            {config?.email && (
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                    <a
                                        href={`mailto:${config.email}`}
                                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                                    >
                                        {config.email}
                                    </a>
                                </div>
                            )}
                            {config?.phone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                    <a
                                        href={`tel:${config.phone.replace(/\s/g, '')}`}
                                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                                    >
                                        {config.phone}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-gray-600 leading-relaxed">
                        Tą samą drogą można składać wnioski o udostępnienie informacji niedostępnej
                        oraz składać żądania zapewnienia dostępności.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Procedura wnioskowo-skargowa</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Każdy ma prawo do wystąpienia z żądaniem zapewnienia dostępności cyfrowej strony internetowej,
                        aplikacji mobilnej lub jakiegoś ich elementu. Można także zażądać udostępnienia informacji
                        w formach alternatywnych, na przykład odczytanie niedostępnego cyfrowo dokumentu,
                        opisania zawartości filmu bez audiodeskrypcji itp.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                        Żądanie powinno zawierać dane osoby zgłaszającej żądanie, wskazanie, o którą stronę
                        internetową lub aplikację mobilną chodzi oraz sposób kontaktu. Jeżeli osoba żądająca
                        zgłasza potrzebę otrzymania informacji w formie alternatywnej, powinna także określić
                        formę tej informacji.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                        Rozpatrzymy żądanie niezwłocznie, nie później niż w ciągu 7 dni od dnia wystąpienia
                        z żądaniem. Jeżeli dotrzymanie tego terminu nie jest możliwe, a realizacja wymaga
                        uzasadnionego przedłużenia, możemy określić najdłuższy możliwy termin rozpatrzenia
                        żądania, jednak nie może on być dłuższy niż 2 miesiące.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Dostępność architektoniczna</h2>
                    {config?.accessibilityInfo ? (
                        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 rounded-lg p-6">
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                {config.accessibilityInfo}
                            </p>
                        </div>
                    ) : config?.orgAddress ? (
                        <p className="text-gray-600 leading-relaxed">
                            Siedziba organizacji znajduje się pod adresem: <strong>{config.orgAddress}</strong>.
                        </p>
                    ) : (
                        <p className="text-gray-600 leading-relaxed">
                            Informacje o dostępności architektonicznej siedziby zostaną udostępnione w najbliższym czasie.
                        </p>
                    )}
                </section>
            </div>
        </div>
    );
}
