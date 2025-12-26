"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function verifyP24ConnectionAction(merchantId: string, posId: string, apiKey: string, crc: string, isSandbox: boolean = false): Promise<{ success: boolean; message: string }> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { success: false, message: "Brak autoryzacji." };
    }

    if (!merchantId || !apiKey) {
        return { success: false, message: "Brak wymaganych danych (Merchant ID, API Key)." };
    }

    const baseUrl = isSandbox ? "https://sandbox.przelewy24.pl" : "https://secure.przelewy24.pl";
    // Using testConnection endpoint
    const url = `${baseUrl}/api/v1/testConnection`;

    try {
        const credentials = Buffer.from(`${merchantId}:${apiKey}`).toString("base64");

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Basic ${credentials}`,
                "Content-Type": "application/json"
            },
            cache: "no-store"
        });

        if (response.ok) {
            // Check CRC check logic? Usually testConnection just checks auth.
            // We can assume if auth works, we are good.
            // PosID is usually same as MerchantID but handled on P24 side.
            return { success: true, message: "Połączenie z Przelewy24 nawiązane pomyślnie!" };
        } else {
            const errorText = await response.text();
            console.error("P24 Test Error:", response.status, errorText);

            if (response.status === 401) {
                return { success: false, message: "Błąd autoryzacji (401). Sprawdź Merchant ID i API Key." };
            }
            return { success: false, message: `Błąd połączenia: ${response.status} ${response.statusText}` };
        }

    } catch (error) {
        console.error("P24 Connection Error:", error);
        return { success: false, message: "Błąd techniczny podczas łączenia z API." };
    }
}
