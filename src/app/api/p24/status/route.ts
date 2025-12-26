
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { P24 } from "@/lib/p24";

export async function POST(req: NextRequest) {
    console.log("Received P24 Notification");

    // Parse Body
    let body;
    try {
        body = await req.json();
    } catch (e) {
        console.error("Failed to parse P24 notification body", e);
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    /* 
       P24 sends notification in body:
       {
         merchantId, posId, sessionId, amount, originAmount, currency, orderId, methodId, statement, sign
       }
    */

    const { merchantId, posId, sessionId, amount, currency, orderId, sign } = body;

    console.log(`Processing notification for Session: ${sessionId}, Order: ${orderId}`);

    // 1. Get Config
    const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });
    if (!config || !config.p24MerchantId || !config.p24ApiKey || !config.p24Crc) {
        console.error("Missing P24 Config in DB");
        return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    // 2. Validate Donation Exists
    const donation = await prisma.donation.findUnique({
        where: { sessionId: sessionId }
    });

    if (!donation) {
        console.error(`Donation not found for session: ${sessionId}`);
        // Return OK to stop P24 from retrying indefinitely if it's a trash request
        return NextResponse.json({ status: "OK" });
    }

    // 3. Verify Transaction with P24
    const p24 = new P24({
        merchantId: parseInt(config.p24MerchantId),
        posId: config.p24PosId ? parseInt(config.p24PosId) : parseInt(config.p24MerchantId),
        apiKey: config.p24ApiKey,
        crc: config.p24Crc
    });

    const isVerified = await p24.verifyTransaction({
        sessionId,
        amount,
        currency,
        orderId
    });

    if (isVerified) {
        // 4. Update Status
        await prisma.donation.update({
            where: { id: donation.id },
            data: {
                status: "COMPLETED",
                orderId: orderId
            }
        });
        console.log(`Donation ${donation.id} confirmed.`);
    } else {
        await prisma.donation.update({
            where: { id: donation.id },
            data: { status: "FAILED" } // or keep PENDING?
        });
        console.error(`Verification failed for session ${sessionId}`);
    }

    return NextResponse.json({ status: "OK" });
}
