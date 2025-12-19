import { prisma } from "@/lib/prisma";
import { FAQManager } from "@/components/admin/FAQManager";

export const dynamic = 'force-dynamic';

export default async function AdminFAQPage() {
    const faqs = await prisma.fAQ.findMany({
        orderBy: { order: 'asc' }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Często Zadawane Pytania ({faqs.length})</h1>
            </div>

            <div className="bg-white shadow sm:rounded-lg border border-gray-200 p-6">
                <p className="font-bold text-gray-900 mb-2">Jak używać tej sekcji?</p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                    <li>Dodawaj pytania, które najczęściej zadają Wasi członkowie lub partnerzy.</li>
                    <li>Ustawiaj "Kolejność" (liczba), aby posortować pytania na stronie.</li>
                    <li>Odpowiedzi mogą być krótkie i treściwe – użytkownik zobaczy je po kliknięciu w pytanie.</li>
                </ul>
            </div>

            <FAQManager initialFaqs={faqs} />
        </div>
    );
}
