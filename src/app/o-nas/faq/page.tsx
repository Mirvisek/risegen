import { prisma } from "@/lib/prisma";
import { FaqAccordion } from "@/components/FaqAccordion";

export const metadata = {
    title: "Najczęściej Zadawane Pytania (FAQ) - RiseGen",
    description: "Znajdź odpowiedzi na najczęściej zadawane pytania dotyczące działalności Stowarzyszenia RiseGen.",
};

export default async function faqPage() {
    const faqs = await prisma.fAQ.findMany({
        orderBy: { order: 'asc' }
    });

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-16 transition-colors">
            <div className="container mx-auto px-4 max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Pytania i Odpowiedzi
                    </h1>
                    <div className="w-24 h-1.5 bg-indigo-600 dark:bg-indigo-500 mx-auto rounded-full"></div>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                        Tutaj znajdziesz odpowiedzi na najczęściej zadawane pytania dotyczące naszej organizacji, projektów i możliwości zaangażowania się.
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8 transition-colors">
                    <FaqAccordion faqs={faqs} />
                </div>

                <div className="text-center pt-8">
                    <p className="text-gray-500 italic">
                        Nie znalazłeś odpowiedzi? <a href="/kontakt" className="text-indigo-600 font-bold hover:underline">Skontaktuj się z nami bezpośrednio.</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
