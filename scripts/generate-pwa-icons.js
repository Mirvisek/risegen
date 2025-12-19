#!/usr/bin/env node

/**
 * Skrypt do generowania ikon PWA z loga
 * Wymaga zainstalowania sharp: npm install sharp
 * 
 * Użycie: node scripts/generate-pwa-icons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512];
const publicDir = path.join(__dirname, '..', 'public');

// Sprawdź czy istnieje logo
const logoPath = path.join(publicDir, 'logo.png');
let inputFile = logoPath;

// Jeśli nie ma logo, użyj favicon
if (!fs.existsSync(logoPath)) {
    const faviconPath = path.join(publicDir, 'favicon.png');
    if (fs.existsSync(faviconPath)) {
        inputFile = faviconPath;
        console.log('ℹ️  Logo nie znalezione, używam favicon.png');
    } else {
        console.error('❌ Nie znaleziono logo.png ani favicon.png w katalogu public/');
        console.log('💡 Umieść plik logo.png w katalogu public/ i uruchom skrypt ponownie');
        process.exit(1);
    }
}

console.log(`📱 Generowanie ikon PWA z: ${path.basename(inputFile)}\n`);

async function generateIcons() {
    for (const size of sizes) {
        const outputPath = path.join(publicDir, `icon-${size}.png`);

        try {
            await sharp(inputFile)
                .resize(size, size, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 0 }
                })
                .png()
                .toFile(outputPath);

            console.log(`✅ Wygenerowano: icon-${size}.png`);
        } catch (error) {
            console.error(`❌ Błąd podczas generowania icon-${size}.png:`, error.message);
        }
    }

    console.log('\n🎉 Gotowe! Ikony PWA zostały wygenerowane.');
}

generateIcons();
