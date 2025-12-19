import { prisma } from "@/lib/prisma";
import { Mail, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import ReactMarkdown from "react-markdown";

export const metadata = {
    title: "Polityka Prywatności",
    description: "Polityka prywatności i ochrony danych osobowych",
};

export default async function PolitykaPrywatnosciPage() {
    const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });

    const defaultContent = `
# Polityka Prywatności

## 1. Informacje ogólne

Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych przekazanych przez Użytkowników w związku z korzystaniem ze strony internetowej ${config?.orgName || "RiseGen"}.

## 2. Administrator danych

Administratorem danych osobowych zbieranych za pośrednictwem strony internetowej jest:

**${config?.orgName || "Stowarzyszenie RiseGen"}**
${config?.orgAddress ? `Adres: ${config.orgAddress}` : ""}
${config?.email ? `Email: ${config.email}` : ""}
${config?.phone ? `Telefon: ${config.phone}` : ""}

## 3. Rodzaje zbieranych danych

W związku z korzystaniem ze strony internetowej możemy zbierać następujące dane:
- Imię i nazwisko
- Adres e-mail
- Numer telefonu
- Treść wiadomości/zgłoszenia
- Dane techniczne (adres IP, przeglądarka, system operacyjny)

## 4. Cele przetwarzania danych

Dane osobowe są przetwarzane w następujących celach:
- Obsługa formularzy kontaktowych i zgłoszeniowych
- Komunikacja z użytkownikami
- Realizacja celów statutowych organizacji
- Prowadzenie statystyk odwiedzin strony

## 5. Podstawa prawna

Przetwarzanie danych osobowych odbywa się na podstawie:
- Zgody użytkownika (art. 6 ust. 1 lit. a RODO)
- Realizacji umowy lub działań przedumownych (art. 6 ust. 1 lit. b RODO)
- Uzasadnionego interesu administratora (art. 6 ust. 1 lit. f RODO)

## 6. Okres przechowywania danych

Dane osobowe przechowywane są przez okres niezbędny do realizacji celów, dla których zostały zebrane, a następnie przez okres wymagany przepisami prawa.

## 7. Prawa użytkowników

Użytkownikom przysługują następujące prawa:
- Prawo dostępu do swoich danych
- Prawo do sprostowania danych
- Prawo do usunięcia danych
- Prawo do ograniczenia przetwarzania
- Prawo do przenoszenia danych
- Prawo do wniesienia sprzeciwu
- Prawo do cofnięcia zgody

## 8. Cookies

Strona wykorzystuje pliki cookies w celach:
- Zapewnienia prawidłowego działania strony
- Analizy ruchu i statystyk
- Dostosowania treści do preferencji użytkownika

Użytkownik może w każdej chwili zmienić ustawienia cookies w swojej przeglądarce.

## 9. Bezpieczeństwo danych

Administrator stosuje odpowiednie środki techniczne i organizacyjne zapewniające ochronę przetwarzanych danych osobowych odpowiednią do zagrożeń oraz kategorii danych objętych ochroną.

## 10. Kontakt

W sprawach dotyczących przetwarzania danych osobowych prosimy o kontakt:
${config?.email ? `Email: ${config.email}` : ""}
${config?.phone ? `Telefon: ${config.phone}` : ""}

## 11. Zmiany polityki prywatności

Administrator zastrzega sobie prawo do wprowadzania zmian w Polityce Prywatności. Aktualna wersja Polityki jest zawsze dostępna na tej stronie.

**Data ostatniej aktualizacji: ${new Date().toLocaleDateString('pl-PL')}**
`;

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <Breadcrumbs items={[{ label: "Polityka Prywatności" }]} />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-gray-900">Polityka Prywatności</h1>
                    <div className="w-20 h-1 bg-indigo-600 mx-auto rounded-full"></div>
                </div>

                <section className="prose prose-gray prose-lg max-w-none text-gray-700">
                    <ReactMarkdown
                        components={{
                            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-3" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2" {...props} />,
                            p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                            li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
                        }}
                    >
                        {config?.privacyPolicyContent || defaultContent}
                    </ReactMarkdown>
                </section>

                <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mt-8">
                    <h3 className="font-semibold text-indigo-900 mb-4">Dane kontaktowe w sprawach prywatności</h3>
                    <div className="space-y-3">
                        {config?.email && (
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-indigo-600" />
                                <a
                                    href={`mailto:${config.email}`}
                                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                                >
                                    {config.email}
                                </a>
                            </div>
                        )}
                        {config?.phone && (
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-indigo-600" />
                                <a
                                    href={`tel:${config.phone.replace(/\s/g, '')}`}
                                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                                >
                                    {config.phone}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
