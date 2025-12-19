import { prisma } from "@/lib/prisma";
import { Mail, Phone, Cookie } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import ReactMarkdown from "react-markdown";

export const metadata = {
    title: "Polityka Cookies",
    description: "Polityka wykorzystywania plików cookies",
};

export default async function PolitykaCookiesPage() {
    const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });

    const defaultContent = `
# Polityka Cookies

## 1. Czym są pliki cookies?

Pliki cookies (ciasteczka) to małe pliki tekstowe zapisywane na Twoim urządzeniu (komputerze, tablecie, smartfonie) podczas odwiedzania stron internetowych. Cookies pozwalają stronie rozpoznać Twoje urządzenie przy kolejnych wizytach.

## 2. Jakie cookies używamy?

Na naszej stronie wykorzystujemy następujące rodzaje plików cookies:

### Cookies niezbędne (sesyjne)
- **Cel**: Zapewnienie prawidłowego działania strony internetowej
- **Typ**: Sesyjne (usuwane po zamknięciu przeglądarki)
- **Przykłady**: Przechowywanie sesji logowania w panelu administracyjnym

### Cookies funkcjonalne
- **Cel**: Zapamiętywanie Twoich preferencji i ustawień
- **Typ**: Trwałe (przechowywane przez określony czas)
- **Przykłady**: Ustawienia językowe, preferencje wyświetlania

${config?.googleAnalyticsId ? `
### Cookies analityczne (Google Analytics)
- **Cel**: Analiza ruchu na stronie i statystyki odwiedzin
- **Typ**: Trwałe
- **Dostawca**: Google Analytics
- **Identyfikator**: ${config.googleAnalyticsId}
- **Funkcje**: 
  - Zliczanie liczby odwiedzin
  - Źródła ruchu
  - Analiza zachowań użytkowników
  - Dane demograficzne (jeśli włączone)
` : ''}

## 3. Podstawa prawna

Stosowanie plików cookies odbywa się na podstawie:
- Zgody użytkownika (art. 6 ust. 1 lit. a RODO)
- Uzasadnionego interesu administratora (art. 6 ust. 1 lit. f RODO)
- Realizacji umowy (art. 6 ust. 1 lit. b RODO)

## 4. Jak zarządzać cookies?

Możesz w każdej chwili zmienić ustawienia dotyczące plików cookies w swojej przeglądarce:

### Google Chrome
1. Kliknij ikonę menu (trzy kropki) → Ustawienia
2. Prywatność i bezpieczeństwo → Pliki cookie i inne dane witryn
3. Wybierz odpowiednią opcję

### Mozilla Firefox
1. Kliknij menu (trzy linie) → Ustawienia
2. Prywatność i bezpieczeństwo
3. Ciasteczka i dane stron

### Safari
1. Preferencje → Prywatność
2. Zarządzaj danami witryn

### Microsoft Edge
1. Ustawienia → Pliki cookie i uprawnienia witryny
2. Zarządzaj i usuń pliki cookie

## 5. Konsekwencje wyłączenia cookies

Wyłączenie plików cookies może wpłynąć na funkcjonalność strony:
- Niemożność zalogowania się do panelu administracyjnego
- Brak zapamiętywania preferencji użytkownika
- Ograniczona funkcjonalność niektórych elementów strony

## 6. Cookies osób trzecich

Nasza strona może wykorzystywać cookies osób trzecich:
${config?.googleAnalyticsId ? '- **Google Analytics** - analiza ruchu i statystyki' : ''}
${config?.facebookUrl ? '- **Facebook** - wtyczki społecznościowe' : ''}
${config?.instagramUrl ? '- **Instagram** - osadzone treści' : ''}

Cookies osób trzecich są zarządzane przez odpowiednich dostawców zgodnie z ich politykami prywatności.

## 7. Aktualizacja polityki cookies

Administrator zastrzega sobie prawo do wprowadzania zmian w Polityce Cookies. Zmiany wchodzą w życie z chwilą opublikowania na stronie.

## 8. Kontakt

W sprawach dotyczących polityki cookies prosimy o kontakt:
${config?.email ? `**Email**: ${config.email}` : ""}
${config?.phone ? `**Telefon**: ${config.phone}` : ""}

---

**Data ostatniej aktualizacji**: ${new Date().toLocaleDateString('pl-PL')}
`;

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <Breadcrumbs items={[{ label: "Polityka Cookies" }]} />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <Cookie className="h-12 w-12 text-indigo-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900">Polityka Cookies</h1>
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
                        {config?.cookiePolicyContent || defaultContent}
                    </ReactMarkdown>
                </section>

                <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 mt-8">
                    <h3 className="font-semibold text-amber-900 mb-4 flex items-center gap-2">
                        <Cookie className="h-5 w-5" />
                        Zarządzanie cookies
                    </h3>
                    <p className="text-sm text-amber-800 mb-3">
                        Możesz w każdej chwili zmienić swoje preferencje dotyczące plików cookies w ustawieniach przeglądarki.
                        Wyłączenie niektórych cookies może wpłynąć na funkcjonalność strony.
                    </p>
                    <div className="space-y-3">
                        {config?.email && (
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-amber-600" />
                                <a
                                    href={`mailto:${config.email}`}
                                    className="text-amber-600 hover:text-amber-800 font-medium"
                                >
                                    {config.email}
                                </a>
                            </div>
                        )}
                        {config?.phone && (
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-amber-600" />
                                <a
                                    href={`tel:${config.phone.replace(/\s/g, '')}`}
                                    className="text-amber-600 hover:text-amber-800 font-medium"
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
