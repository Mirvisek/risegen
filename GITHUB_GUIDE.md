# Poradnik: Jak wgrać projekt na GitHub

Ten poradnik przeprowadzi Cię przez proces wrzucenia Twoich plików na nowe repozytorium GitHub.

## 1. Przygotowanie konta i repozytorium
1. Zaloguj się na [GitHub.com](https://github.com).
2. Kliknij ikonę **+** w prawym górnym rogu i wybierz **New repository**.
3. Nadaj nazwę (np. `risegen`).
4. Wybierz widoczność (**Public** lub **Private**).
5. **Ważne:** Nie dodawaj pliku README, .gitignore ani licencji (zrobimy to lokalnie).
6. Kliknij **Create repository**.

## 2. Inicjalizacja Gita w folderze projektu
Otwórz terminal w folderze projektu `risegen` na Twoim komputerze i wykonaj poniższe komendy:

```bash
# Jeśli jeszcze nie masz zainicjowanego gita:
git init

# Dodaj wszystkie pliki do "poczekalni"
git add .

# Stwórz pierwszy zapis (commit)
git commit -m "Initial commit - cleaned project for VPS"

# Zmień nazwę głównej gałęzi na main
git branch -M main
```

## 3. Połączenie z GitHubem
Skopiuj URL swojego repozytorium z GitHuba (będzie wyglądał tak: `https://github.com/TwojUzytkownik/risegen.git`) i wpisz:

```bash
# Połącz lokalny folder z serwerem GitHub
git remote add origin https://github.com/TwojUzytkownik/risegen.git

# Wyślij pliki na serwer
git push -u origin main
```

---

## Najczęstsze pytania i błędy:

### Co jeśli w przyszłości coś zmienię?
Gdy zmienisz coś w kodzie, wystarczy, że wpiszesz te 3 komendy:
1. `git add .` – przygotuj zmiany.
2. `git commit -m "Opis zmian"` – zapisz zmiany.
3. `git push` – wyślij na GitHub.

### Co jeśli wyskakuje błąd przy `git push`?
Jeśli GitHub prosi o hasło, a zwykłe hasło do konta nie działa, musisz wygenerować **Personal Access Token (Classic)** w ustawieniach GitHub (Settings -> Developer Settings -> Personal access tokens) i użyć go zamiast hasła.

### Czy plik `.env` trafi na GitHub?
Nie. W Twoim projekcie jest plik `.gitignore`, który blokuje wysyłanie pliku `.env`. To bardzo ważne dla bezpieczeństwa, ponieważ `.env` zawiera tajne klucze i hasła. Na serwerze VPS będziesz musiał stworzyć ten plik ręcznie.
