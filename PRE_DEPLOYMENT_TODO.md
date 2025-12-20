# 🚀 LISTA TODO PRZED WDROŻENIEM NA VPS

**Projekt:** RiseGen  
**Środowisko:** VPS Debian 12  
**Data:** 19 grudnia 2025

---

## 📋 PRZED ROZPOCZĘCIEM WDROŻENIA

### 1. Przygotowanie Danych Dostępowych

- [ ] **Dane logowania do VPS**
  - IP serwera: `________________`
  - User: `root` lub `________________`
  - Hasło/SSH key: `________________`

- [ ] **Domena**
  - Domena: `risegen.pl`
  - DNS skonfigurowane (A record → IP serwera): ☐
  - WWW subdomain: ☐

- [ ] **Dostęp do repozytorium Git**
  - URL repozytorium: `________________`
  - Klucz SSH lub token: ☐
  - Branch do deployment: `main` / `________________`

---

## 🔐 PRZYGOTOWANIE ZMIENNYCH ŚRODOWISKOWYCH

### 2. Wygenerowanie Sekretów

- [ ] **NEXTAUTH_SECRET**
  ```bash
  openssl rand -base64 32
  ```
  Wynik: `________________`

### 3. Konfiguracja SMTP

- [ ] **Dostawca SMTP**
  - Wybór dostawcy: SendGrid / Mailgun / Gmail / Inny: `________________`
  - SMTP Host: `________________`
  - SMTP Port: `587` / `465` / `________________`
  - Username: `________________`
  - Password: `________________`
  - From email: `no-reply@risegen.pl`

### 4. Google Services

- [ ] **reCAPTCHA v2**
  - Zarejestruj domenę: https://www.google.com/recaptcha/admin
  - Site Key: `________________`
  - Secret Key: `________________`

- [ ] **Google Analytics** (Opcjonalne)
  - GA4 Measurement ID: `G-________________`

### 5. Przygotowanie pliku .env

- [ ] Skopiować szablon `ENV_TEMPLATE.md`
- [ ] Wypełnić wszystkie wartości
- [ ] Zapisać bezpiecznie (np. password manager)
- [ ] Przygotować do uploadowania na serwer

---

## 🖥️ KONFIGURACJA SERWERA VPS

### 6. Połączenie z Serwerem

- [ ] Połącz się przez SSH
  ```bash
  ssh root@[IP_SERWERA]
  ```

### 7. Aktualizacja Systemu

- [ ] Update pakietów
  ```bash
  apt update && apt upgrade -y
  ```

- [ ] Instalacja podstawowych narzędzi
  ```bash
  apt install -y curl git unzip build-essential
  ```

### 8. Instalacja Node.js 20 LTS

- [ ] Dodaj repozytorium NodeSource
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  ```

- [ ] Instalacja Node.js
  ```bash
  apt install -y nodejs
  ```

- [ ] Weryfikacja wersji
  ```bash
  node -v  # powinno zwrócić v20.x.x
  npm -v
  ```

### 9. Instalacja PM2

- [ ] Instalacja PM2 globalnie
  ```bash
  npm install -g pm2
  ```

### 10. Instalacja Nginx

- [ ] Instalacja
  ```bash
  apt install -y nginx
  ```

- [ ] Sprawdź status
  ```bash
  systemctl status nginx
  ```

### 11. Instalacja Certbot (SSL)

- [ ] Instalacja Certbot
  ```bash
  apt install -y certbot python3-certbot-nginx
  ```

---

## 📦 DEPLOYMENT APLIKACJI

### 12. Klonowanie Repozytorium

- [ ] Utwórz katalog
  ```bash
  mkdir -p /var/www
  cd /var/www
  ```

- [ ] Clone projektu
  ```bash
  git clone [URL_REPOZYTORIUM] risegen
  cd risegen
  ```

### 13. Instalacja Zależności

- [ ] NPM install
  ```bash
  npm install
  ```

### 14. Konfiguracja Zmiennych Środowiskowych

- [ ] Utwórz plik .env
  ```bash
  nano .env
  ```

- [ ] Wklej przygotowane zmienne (z kroku 5)

- [ ] Zapisz i ustaw uprawnienia
  ```bash
  chmod 600 .env
  ```

### 15. Konfiguracja Bazy Danych

- [ ] Wygeneruj Prisma Client
  ```bash
  npx prisma generate
  ```

- [ ] Push schema do bazy
  ```bash
  npx prisma db push
  ```

- [ ] (Opcjonalnie) Załaduj dane testowe
  ```bash
  npx prisma db seed
  ```

### 16. Build Production

- [ ] Zbuduj aplikację
  ```bash
  npm run build
  ```

- [ ] Sprawdź czy build się powiódł (brak błędów)

### 17. Uruchomienie z PM2

- [ ] Start aplikacji
  ```bash
  pm2 start npm --name "risegen" -- start
  ```

- [ ] Sprawdź status
  ```bash
  pm2 status
  pm2 logs risegen
  ```

- [ ] Zapisz konfigurację PM2
  ```bash
  pm2 save
  pm2 startup
  ```
  - [ ] Wykonaj komendę pokazaną przez `pm2 startup`

### 18. Test Lokalny

- [ ] Sprawdź czy aplikacja działa lokalnie
  ```bash
  curl http://localhost:3000
  ```

---

## 🌐 KONFIGURACJA NGINX

### 19. Konfiguracja Nginx

- [ ] Utwórz plik konfiguracyjny
  ```bash
  nano /etc/nginx/sites-available/risegen
  ```

- [ ] Wklej konfigurację (patrz DEPLOYMENT_GUIDE.md)
  - Zamień `twoja-domena.pl` na `risegen.pl`

- [ ] Aktywuj konfigurację
  ```bash
  ln -s /etc/nginx/sites-available/risegen /etc/nginx/sites-enabled/
  ```

- [ ] Usuń domyślną konfigurację (jeśli nie potrzebna)
  ```bash
  rm /etc/nginx/sites-enabled/default
  ```

- [ ] Test konfiguracji
  ```bash
  nginx -t
  ```

- [ ] Restart Nginx
  ```bash
  systemctl restart nginx
  ```

### 20. Test HTTP

- [ ] Otwórz w przeglądarce: `http://risegen.pl`
- [ ] Sprawdź czy strona się ładuje

---

## 🔒 KONFIGURACJA SSL (HTTPS)

### 21. Generowanie Certyfikatu

- [ ] Uruchom Certbot
  ```bash
  certbot --nginx -d risegen.pl -d www.risegen.pl
  ```

- [ ] Postępuj zgodnie z instrukcjami (podaj email, akceptuj ToS)

- [ ] Wybierz opcję przekierowania HTTP→HTTPS (recommended)

### 22. Test HTTPS

- [ ] Otwórz: `https://risegen.pl`
- [ ] Sprawdź certyfikat SSL (kłódka w przeglądarce)

### 23. Auto-odnowienie Certyfikatu

- [ ] Test odnowienia
  ```bash
  certbot renew --dry-run
  ```

---

## ✅ TESTOWANIE APLIKACJI

### 24. Funkcjonalność Podstawowa

- [ ] Strona główna ładuje się poprawnie
- [ ] Menu nawigacji działa
- [ ] Obrazki się wyświetlają
- [ ] Projekty się ładują
- [ ] Aktualności się ładują

### 25. Panel Administracyjny

- [ ] Login do panelu: `https://risegen.pl/auth/login`
- [ ] Sprawdź czy możesz się zalogować
- [ ] Dashboard wyświetla się poprawnie
- [ ] Edycja projektu działa
- [ ] Upload plików działa

### 26. Formularze

- [ ] Formularz kontaktowy działa
- [ ] ReCAPTCHA działa
- [ ] Email z formularza przychodzi

### 27. PWA (Progressive Web App)

- [ ] Manifest dostępny: `https://risegen.pl/manifest.webmanifest`
- [ ] Service Worker rejestruje się
- [ ] Install PWA prompt pojawia się (mobile)
- [ ] Install PWA prompt pojawia się (mobile)

### 28. SEO

- [ ] robots.txt: `https://risegen.pl/robots.txt`
- [ ] Sitemap.xml: `https://risegen.pl/sitemap.xml`
- [ ] Meta tags w źródle strony

---

## 🔧 KONFIGURACJA BACKUPÓW

### 29. Backup Bazy Danych

- [ ] Skrypt backup SQLite
  ```bash
  nano /root/backup-db.sh
  ```

  ```bash
  #!/bin/bash
  DATE=$(date +%Y%m%d_%H%M%S)
  cp /var/www/risegen/dev.db /root/backups/db_backup_$DATE.db
  # Zachowaj tylko ostatnie 7 backupów
  ls -t /root/backups/db_backup_*.db | tail -n +8 | xargs rm -f
  ```

- [ ] Nadaj uprawnienia
  ```bash
  chmod +x /root/backup-db.sh
  mkdir -p /root/backups
  ```

- [ ] Dodaj do crontab (codziennie o 2:00)
  ```bash
  crontab -e
  ```
  Dodaj linię:
  ```
  0 2 * * * /root/backup-db.sh
  ```

### 30. Backup Uploads

- [ ] Podobnoskrypt dla `/var/www/risegen/public/uploads`

---

## 📊 MONITORING

### 31. Logi i Monitoring

- [ ] Sprawdź logi PM2
  ```bash
  pm2 logs risegen
  ```

- [ ] Sprawdź logi Nginx
  ```bash
  tail -f /var/log/nginx/access.log
  tail -f /var/log/nginx/error.log
  ```

- [ ] Sprawdź status systemu
  ```bash
  pm2 monit
  ```

---

## 🎉 GOTOWE!

### 32. Finalizacja

- [ ] Dokumentacja wdrożenia zapisana
- [ ] Dane dostępowe bezpiecznie przechowane
- [ ] Backupy skonfigurowane
- [ ] Monitoring działa

### 33. Poinformuj Zespół

- [ ] Strona dostępna pod: `https://risegen.pl`
- [ ] Panel admin: `https://risegen.pl/admin`
- [ ] Przekaż dane logowania

---

## 📞 W RAZIE PROBLEMÓW

- **PM2 nie działa:** `pm2 restart risegen`
- **Nginx błąd:** `nginx -t` i sprawdź `/var/log/nginx/error.log`
- **Build fails:** Sprawdź wersję Node.js, przeinstaluj node_modules
- **Database error:** Sprawdź uprawnienia do `dev.db`
- **SSL wygasł:** `certbot renew`

---

## 🔄 AKTUALIZACJE W PRZYSZŁOŚCI

Gdy pojawią się zmiany w kodzie:

```bash
cd /var/www/risegen
git pull
npm install
npx prisma db push
npm run build
pm2 restart risegen
```

---

*Powodzenia w deployment! 🚀*
