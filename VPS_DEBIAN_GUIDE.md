# Instrukcja instalacji RiseGen na serwerze VPS (Debian 12)

Poniższa instrukcja krok po kroku przeprowadzi Cię przez proces instalacji aplikacji RiseGen na czystym systemie Debian 12, wykorzystując Node.js, PM2 (do zarządzania procesem) oraz Nginx (jako serwer proxy).

## Spis treści
1. [Wstępna konfiguracja serwera](#1-wstępna-konfiguracja-serwera)
2. [Instalacja Node.js](#2-instalacja-nodejs)
3. [Instalacja i budowanie aplikacji](#3-instalacja-i-budowanie-aplikacji)
4. [Konfiguracja PM2 (Process Manager)](#4-konfiguracja-pm2)
5. [Konfiguracja Nginx (Reverse Proxy)](#5-konfiguracja-nginx)
6. [Certyfikat SSL (HTTPS)](#6-certyfikat-ssl-https)

---

## 1. Wstępna konfiguracja serwera

Po zalogowaniu się na serwer przez SSH (jako `root` lub użytkownik z uprawnieniami sudo), zaktualizuj system:

```bash
apt update && apt upgrade -y
```

Zainstaluj podstawowe narzędzia:

```bash
apt install -y curl git unzip build-essential
```

---

## 2. Instalacja Node.js

Zainstalujemy Node.js w wersji 20 (LTS) korzystając z oficjalnego repozytorium NodeSource.

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

Sprawdź poprawność instalacji:
```bash
node -v
# Powinno zwrócić np. v20.x.x
npm -v
```

---

## 3. Instalacja i budowanie aplikacji

### 3.1. Pobranie kodu
Zalecamy umieszczenie aplikacji w katalogu `/var/www/risegen`.

```bash
mkdir -p /var/www/risegen
cd /var/www/risegen
```

Możesz przesłać pliki przez SFTP (np. FileZilla) lub sklonować repozytorium Git, jeśli je posiadasz.
Jeśli przesyłasz pliki ręcznie, upewnij się, że przesyłasz wszystko **oprócz** folderów `node_modules` i `.next`.

### 3.2. Konfiguracja zmiennych środowiskowych
Stwórz plik `.env` w głównym katalogu aplikacji:

```bash
nano .env
```

Wklej zawartość (uzupełnij własnymi danymi):

```env
# Baza Danych (SQLite)
DATABASE_URL="file:./prod.db"

# Next Auth (wygeneruj losowy ciąg np. poleceniem: openssl rand -base64 32)
NEXTAUTH_SECRET="twoj-super-tajny-klucz-zmien-go"
NEXTAUTH_URL="https://twoja-domena.pl"

# Uploads (ważne dla zdjęć)
UPLOAD_DIR="./public/uploads"
```

Zapisz plik (`Ctrl+O`, `Enter`) i wyjdź (`Ctrl+X`).

### 3.3. Instalacja zależności i budowanie

```bash
# Instalacja zależności
npm install

# Generowanie klienta Prisma
npx prisma generate

# Migracja bazy danych (utworzy plik prod.db)
npx prisma db push

# Budowanie aplikacji produkcyjnej
npm run build
```

---

## 4. Konfiguracja PM2

PM2 to menedżer procesów, który utrzyma Twoją aplikację "przy życiu" nawet po restarcie serwera.

```bash
# Instalacja PM2 globalnie
npm install -g pm2

# Uruchomienie aplikacji
pm2 start npm --name "risegen" -- start

# Zapisanie listy procesów, aby wstawały po restarcie
pm2 save

# Wygenerowanie skryptu startowego (wykonaj polecenie, które wypluje ta komenda)
pm2 startup
```

---

## 5. Konfiguracja Nginx

Nginx posłuży jako serwer, który przyjmie ruch z internetu (port 80/443) i przekaże go do Twojej aplikacji (port 3000).

```bash
# Instalacja Nginx
apt install -y nginx
```

Utwórz plik konfiguracyjny dla strony:

```bash
nano /etc/nginx/sites-available/risegen
```

Wklej poniższą konfigurację (zamień `twoja-domena.pl` na swój adres):

```nginx
server {
    server_name twoja-domena.pl www.twoja-domena.pl;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Obsługa dużych plików (np. upload zdjęć)
    client_max_body_size 10M;
}
```

Aktywuj stronę i zrestartuj Nginx:

```bash
# Linkowanie konfiguracji
ln -s /etc/nginx/sites-available/risegen /etc/nginx/sites-enabled/

# Sprawdzenie poprawności
nginx -t

# Restart serwera
systemctl restart nginx
```

---

## 6. Certyfikat SSL (HTTPS)

Użyjemy Certbot, aby uzyskać darmowy certyfikat od Let's Encrypt.

```bash
# Instalacja Certbot i pluginu Nginx
apt install -y certbot python3-certbot-nginx

# Generowanie certyfikatu (postępuj zgodnie z instrukcjami na ekranie)
certbot --nginx -d twoja-domena.pl -d www.twoja-domena.pl
```

Gotowe! Twoja strona powinna być teraz dostępna pod adresem `https://twoja-domena.pl`.

---

## Rozwiązywanie problemów

### Uprawnienia do plików
Jeśli nie możesz wgrywać zdjęć, upewnij się, że użytkownik, na którym działa Nginx/Node ma prawa do zapisu w folderze `public/uploads` oraz do pliku bazy danych `prod.db`.

```bash
# Jeśli uruchamiasz PM2 jako root (domyślnie), to powinno działać.
# Jeśli masz problemy z zapisem:
chmod -R 755 public/uploads
chmod 666 prod.db
```

### Podgląd logów
Jeśli coś nie działa, sprawdź logi aplikacji:
```bash
pm2 logs risegen
```
