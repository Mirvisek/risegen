import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailSender";

export async function POST(req: Request) {
    try {
        // 1. Load Config
        const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });
        if (!config || !config.enableNewsletter) {
            return NextResponse.json({ message: "Newsletter disabled" });
        }

        if (config.enableDripCampaign === false) {
            return NextResponse.json({ message: "Drip Campaign disabled" });
        }

        // 2. Throttle: Run at most once per hour
        const now = new Date();
        if (config.lastDripRun) {
            const timeDiff = now.getTime() - new Date(config.lastDripRun).getTime();
            if (timeDiff < 60 * 60 * 1000) { // 1 hour in ms
                return NextResponse.json({ message: "Throttled (run less than 1h ago)" });
            }
        }

        // 3. Process Step 1 -> Step 2 (Day 2 Email)
        // Find subscribers who are at step 0 AND createdAt is older than dripDay2Delay days
        const delayMsDay2 = config.dripDay2Delay * 24 * 60 * 60 * 1000;
        const cutoffDay2 = new Date(now.getTime() - delayMsDay2);

        const subscribersForDay2 = await prisma.subscriber.findMany({
            where: {
                dripStep: 0,
                isActive: true,
                createdAt: { lt: cutoffDay2 }
            },
            take: 50 // Process in batches to avoid timeout
        });

        let sentDay2 = 0;
        for (const sub of subscribersForDay2) {
            try {
                await sendEmail({
                    to: sub.email,
                    subject: config.dripDay2Subject || "Poznaj nasze największe sukcesy! 🌟",
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #4f46e5;">Nasze duma, nasze sukcesy</h2>
                            <p>Cześć ${sub.name || "Przyjacielu"}! 👋</p>
                            ${config.dripDay2Content ? `<p>${config.dripDay2Content}</p>` : `
                                <p>Minęło kilka dni, odkąd do nas dołączyłeś. Chcieliśmy pokazać Ci, co udało nam się osiągnąć dzięki wsparciu osób takich jak Ty.</p>
                                <ul>
                                    <li>🚀 <strong>Projekt X:</strong> Zrealizowaliśmy [opis sukcesu].</li>
                                    <li>🌍 <strong>Wydarzenie Y:</strong> Zgromadziliśmy [ilość] osób.</li>
                                    <li>❤️ <strong>Pomoc Z:</strong> Pomogliśmy [komu].</li>
                                </ul>
                                <p>To dopiero początek. Cieszymy się, że jesteś z nami w tej podróży.</p>
                            `}
                            <br/>
                            <p style="color: #666; font-size: 14px;">– Zespół RiseGen</p>
                        </div>
                    `,
                    fromConfigKey: "emailFromNewsletter"
                });
                // Advance step
                await prisma.subscriber.update({ where: { id: sub.id }, data: { dripStep: 1 } });
                sentDay2++;
            } catch (err) {
                console.error(`Failed to send Day 2 email to ${sub.email}:`, err);
            }
        }

        // 4. Process Step 2 -> Step 3 (Day 5 Email)
        // Find subscribers who are at step 1 AND createdAt is older than dripDay5Delay days
        const delayMsDay5 = config.dripDay5Delay * 24 * 60 * 60 * 1000;
        const cutoffDay5 = new Date(now.getTime() - delayMsDay5);

        const subscribersForDay5 = await prisma.subscriber.findMany({
            where: {
                dripStep: 1,
                isActive: true,
                createdAt: { lt: cutoffDay5 }
            },
            take: 50
        });

        let sentDay5 = 0;
        for (const sub of subscribersForDay5) {
            try {
                await sendEmail({
                    to: sub.email,
                    subject: config.dripDay5Subject || "Chcesz dołączyć do działania? 🤝",
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #4f46e5;">Razem możemy więcej</h2>
                            <p>Cześć ${sub.name || "Przyjacielu"}!</p>
                             ${config.dripDay5Content ? `<p>${config.dripDay5Content}</p>` : `
                                <p>Widzisz już, co robimy. Teraz pytanie - czy chciałbyś stać się częścią tej zmiany?</p>
                                <p>Szukamy wolontariuszy, którzy chcą poświęcić chwilę swojego czasu, aby robić wielkie rzeczy.</p>
                                <p><a href="https://risegen.pl/zgloszenia" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Dołącz do wolontariatu</a></p>
                                <p>Nawet najmniejsza pomoc ma znaczenie!</p>
                            `}
                            <br/>
                            <p style="color: #666; font-size: 14px;">– Zespół RiseGen</p>
                        </div>
                    `,
                    fromConfigKey: "emailFromNewsletter"
                });
                // Advance step
                await prisma.subscriber.update({ where: { id: sub.id }, data: { dripStep: 2 } });
                sentDay5++;
            } catch (err) {
                console.error(`Failed to send Day 5 email to ${sub.email}:`, err);
            }
        }

        // 5. Update Last Run
        await prisma.siteConfig.update({
            where: { id: "main" },
            data: { lastDripRun: now }
        });

        return NextResponse.json({
            success: true,
            processed: { day2: sentDay2, day5: sentDay5 }
        });

    } catch (error) {
        console.error("Drip error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
