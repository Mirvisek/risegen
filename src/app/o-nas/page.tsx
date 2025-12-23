import { prisma } from "@/lib/prisma";
import ReactMarkdown from "react-markdown";

export const metadata = {
    title: "O Nas - RiseGen",
};

export default async function AboutPage() {
    const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">O Stowarzyszeniu</h1>
                <div className="w-20 h-1 bg-indigo-600 mx-auto rounded-full"></div>
            </div>

            <div className="prose prose-lg mx-auto text-gray-600 dark:text-gray-400 dark:prose-invert">
                {config?.aboutUsText ? (
                    <ReactMarkdown
                        components={{
                            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-6 mb-4" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-5 mb-3" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2" {...props} />,
                            p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                            li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900 dark:text-white" {...props} />,
                        }}
                    >
                        {config.aboutUsText}
                    </ReactMarkdown>
                ) : (
                    <>
                        <p>
                            Stowarzyszenie <strong>RiseGen</strong> to inicjatywa zrodzona z potrzeby działania.
                            Jesteśmy grupą młodych, ambitnych ludzi, którym zależy na rozwoju naszego regionu.
                            Wierzymy, że poprzez współpracę i zaangażowanie możemy realnie wpływać na otaczającą nas rzeczywistość.
                        </p>
                        <p>
                            Naszą misją jest łączenie pokoleń. Chcemy, aby młodzi ludzie czerpali wiedzę i inspirację
                            od doświadczonych członków społeczności, jednocześnie wnosząc swoją energię,
                            nowoczesne spojrzenie i znajomość nowych technologii.
                        </p>
                    </>
                )}

                <h3 className="text-gray-900 dark:text-white">Nasze Cele</h3>
                {config?.aboutUsGoals ? (
                    <ReactMarkdown
                        components={{
                            ul: ({ node, ...props }) => <ul className="list-disc pl-6 space-y-2" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-6 space-y-2" {...props} />,
                            li: ({ node, ...props }) => <li className="leading-relaxed font-bold italic" {...props} />,
                            p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                        }}
                    >
                        {config.aboutUsGoals}
                    </ReactMarkdown>
                ) : (
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Integracja społeczności lokalnej.</li>
                        <li>Wspieranie rozwoju osobistego i zawodowego młodzieży.</li>
                        <li>Promowanie współpracy międzypokoleniowej.</li>
                        <li>Organizowanie warsztatów, szkoleń i wydarzeń kulturalnych.</li>
                    </ul>
                )}

                <h3 className="text-gray-900 dark:text-white">Dołącz do nas</h3>
                {config?.aboutUsJoinText ? (
                    <ReactMarkdown
                        components={{
                            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-6 mb-4" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-5 mb-3" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2" {...props} />,
                            p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                            li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900 dark:text-white" {...props} />,
                        }}
                    >
                        {config.aboutUsJoinText}
                    </ReactMarkdown>
                ) : (
                    <p>
                        Jesteśmy otwarci na każdego, kto chce działać. Jeśli masz pomysł na projekt, chcesz pomóc w organizacji wydarzeń, lub po prostu poznać ciekawych ludzi – RiseGen jest miejscem dla Ciebie.
                    </p>
                )}
            </div>
        </div>
    );
}
