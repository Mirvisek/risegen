import { prisma } from "@/lib/prisma";
import { FAQManager } from "@/components/admin/FAQManager";

export const dynamic = 'force-dynamic';

export default async function AdminFAQPage() {
    const faqs = await prisma.fAQ.findMany({
        orderBy: { order: 'asc' }
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Często Zadawane Pytania (FAQ)</h1>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg text-amber-800 dark:text-amber-200 text-sm">
                <p className="font-bold mb-1 italic text-base">Jak używać tej sekcji?</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Dodawaj pytania, które najczęściej zadają Wasi członkowie lub partnerzy.</li>
                    <li>Ustawiaj "Kolejność" (liczba), aby posortować pytania na stronie.</li>
                    <li>Odpowiedzi mogą być krótkie i treściwe – użytkownik zobaczy je po kliknięciu w pytanie.</li>
                </ul>
            </div>

            <FAQManager initialFaqs={faqs} />
        </div>
    );
}
