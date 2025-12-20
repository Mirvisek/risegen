# Instrukcja Wdrożenia na VPS

Twoja aplikacja jest w 100% gotowa do wdrożenia przy użyciu Dockera. Poniżej znajdziesz kroki, które należy wykonać na serwerze.

## 1. Wymagania na serwerze VPS
Upewnij się, że na serwerze zainstalowane są:
- Docker
- Docker Compose

## 2. Przesłanie plików
Prześlij na serwer (np. do katalogu `/opt/risegen`) następujące pliki i katalogi z Twojego projektu:
- `Dockerfile`
- `docker-compose.yml`
- Katalog `scripts/` (zawierający `start.sh`)
- Katalog `prisma/` (jest potrzebny do budowania obrazu i migracji)
- `package.json` i `package-lock.json`
- `next.config.ts`
- `tsconfig.json`
- `postcss.config.mjs`
- `tailwind.config.ts` (lub podobne configi jeśli są)
- Katalog `src/`
- Katalog `public/`

*Najprościej przesłać całą zawartość folderu projektu (zmieniając wcześniej nazwę `.env` na `.env.production` lub ustawiając zmienne w docker-compose).*

## 3. Uruchomienie
Będąc w katalogu z plikami na serwerze, wykonaj:

```bash
docker compose up -d --build
```
To polecenie:
1. Zbuduje obraz aplikacji (może potrwać kilka minut).
2. Stworzy kontenery.
3. Wykona automatycznie migracje bazy danych.
4. Uruchomi serwer na porcie 3000.

## 4. Weryfikacja
Aplikacja powinna być dostępna pod adresem IP Twojego serwera na porcie 3000, np. `http://TWOJE_IP:3000`.

## 5. Ważne uwagi
- **Baza danych**: Dane zapisywane są w katalogu `./prisma_data` na serwerze (dzięki wolumenom w docker-compose). Nie skasuj tego katalogu!
- **Pliki (Uploads)**: Przesłane zdjęcia trafiają do `./uploads` na serwerze.
- **Bezpieczeństwo**: W pliku `docker-compose.yml` zmień `NEXTAUTH_SECRET` na długi, losowy ciąg znaków.
