#!/usr/bin/env node

/**
 * Skrypt do generowania kluczy VAPID dla Web Push Notifications
 * Uruchom: node scripts/generate-vapid-keys.js
 */

const webpush = require('web-push');

console.log('🔑 Generowanie kluczy VAPID dla Web Push...\n');

const vapidKeys = webpush.generateVAPIDKeys();

console.log('✅ Klucze zostały wygenerowane!\n');
console.log('📋 Dodaj te wartości do pliku .env:\n');
console.log('NEXT_PUBLIC_VAPID_PUBLIC_KEY=' + vapidKeys.publicKey);
console.log('VAPID_PRIVATE_KEY=' + vapidKeys.privateKey);
console.log('\n⚠️  WAŻNE: Zachowaj te klucze w bezpiecznym miejscu!');
console.log('   Klucz prywatny NIE MOŻE być udostępniony publicznie.\n');

// Zapisz do pliku .env.local (jeśli istnieje)
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = `
# Web Push Notification Keys (wygenerowane ${new Date().toLocaleString('pl-PL')})
NEXT_PUBLIC_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}
VAPID_PRIVATE_KEY=${vapidKeys.privateKey}
PUSH_EMAIL=mailto:admin@risegen.pl
`;

try {
    // Sprawdź czy plik istnieje
    if (fs.existsSync(envPath)) {
        // Dopisz do istniejącego pliku
        fs.appendFileSync(envPath, envContent);
        console.log('✅ Klucze zostały dodane do .env.local\n');
    } else {
        // Utwórz nowy plik
        fs.writeFileSync(envPath, envContent.trim());
        console.log('✅ Utworzono plik .env.local z kluczami\n');
    }
} catch (error) {
    console.log('⚠️  Nie udało się zapisać do .env.local');
    console.log('   Skopiuj klucze ręcznie do swojego pliku .env\n');
}

console.log('🎉 Gotowe! Możesz teraz używać Web Push Notifications.\n');
