
"use server";

import { prisma } from "@/lib/prisma";
import { P24 } from "@/lib/p24";
import { headers } from "next/headers";

export async function processDonationAction(amount: number, email: string) {
    if (!amount || amount <= 0) {
        return { success: false, message: "Nieprawidłowa kwota." };
    }
    if (!email || !email.includes("@")) {
        return { success: false, message: "Nieprawidłowy adres email." };
    }

    // 1. Get Config
    const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });

    if (!config?.enableDonations || !config.p24MerchantId || !config.p24ApiKey || !config.p24Crc) {
        return { success: false, message: "Płatności są obecnie wyłączone." };
    }

    const merchantId = parseInt(config.p24MerchantId);
    const posId = config.p24PosId ? parseInt(config.p24PosId) : merchantId;
    const apiKey = config.p24ApiKey;
    const crc = config.p24Crc;
    const isSandbox = config.p24IsSandbox === true;

    if (isNaN(merchantId)) {
        return { success: false, message: "Błąd konfiguracji płatności (ID)." };
    }

    // 2. Init P24
    const p24 = new P24({
        merchantId,
        posId,
        apiKey,
        crc,
        isSandbox: isSandbox
    });

    // 3. Create Session ID & Base URL
    const sessionId = `donate_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    // 4. Save to DB (Status: PENDING)
    try {
        await prisma.donation.create({
            data: {
                amount: amount, // grosze
                currency: "PLN",
                description: "Darowizna na cele statutowe",
                email: email,
                sessionId: sessionId,
                status: "PENDING"
            }
        });
    } catch (e) {
        console.error("Database error creating donation:", e);
        return { success: false, message: "Błąd bazy danych." };
    }

    // 5. Register in P24
    const result = await p24.registerTransaction({
        sessionId: sessionId,
        amount: amount,
        currency: "PLN",
        description: "Darowizna na cele statutowe",
        email: email,
        urlReturn: `${baseUrl}/wesprzyj-nas?status=success`,
        urlStatus: `${baseUrl}/api/p24/status`,
        language: "pl"
    });

    if (result && result.url) {
        return { success: true, paymentUrl: result.url };
    } else {
        return { success: false, message: "Błąd rejestracji płatności w P24." };
    }
}
