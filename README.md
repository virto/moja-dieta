# Moja Dieta — PWA na Vercel z plikiem JSON

Aplikacja nie używa bazy danych ani logowania. Wszystkie informacje są przechowywane w jednym pliku `diet-app/diet-data.json` w Vercel Blob.

## Publikacja

1. Rozpakuj projekt i umieść go w repozytorium GitHub.
2. W Vercel wybierz **Add New → Project** i zaimportuj repozytorium.
3. W projekcie Vercel otwórz **Storage**, utwórz **Blob store** i połącz go z projektem.
4. Vercel automatycznie doda zmienną `BLOB_READ_WRITE_TOKEN`.
5. Wykonaj ponowne wdrożenie: **Deployments → Redeploy**.
6. Otwórz adres aplikacji. Pierwszy zapis utworzy plik JSON.

## Instalacja na telefonie

- Android/Chrome: menu → **Zainstaluj aplikację** lub **Dodaj do ekranu głównego**.
- iPhone/Safari: Udostępnij → **Do ekranu początkowego**.

## Bezpieczeństwo

Brak logowania oznacza, że każda osoba znająca adres aplikacji może odczytać i zmienić dane. Nie przechowuj w niej informacji medycznych ani innych danych wrażliwych. Najbezpieczniej nie udostępniać adresu publicznie.

## Uruchomienie lokalne

1. `npm install`
2. `vercel dev`

Do lokalnego zapisu online potrzebny jest token Blob w pliku `.env.local`.

## Import i eksport Excel

W sekcji **Dane** dostępne są:
- eksport całej zawartości do pliku `.xlsx`,
- import pliku `.xlsx` lub `.xls`.

Eksport tworzy arkusze: `Produkty`, `Przepisy`, `Skladniki`, `Plan_diety`, `Pomiary`.
Najbezpieczniej wykonać eksport, edytować ten plik, a następnie zaimportować go ponownie. Import zastępuje aktualne dane zapisane online.

## Koszyk zakupowy

Zakładka **Koszyk** pozwala:
- generować listę zakupów z planu diety dla wybranego zakresu dat,
- sumować powtarzające się składniki,
- grupować produkty według kategorii,
- dodawać, edytować i usuwać pozycje ręcznie,
- oznaczać produkty jako kupione,
- eksportować i importować arkusz `Lista_zakupow` w Excelu.

Produkty mają teraz pole `Kategoria`, wykorzystywane przy generowaniu koszyka.

## Nadpisywanie pliku Vercel Blob

Zapis pliku `diet-app/diet-data.json` używa opcji `allowOverwrite: true`.

## Wersja v7
- naprawiona wyszukiwarka produktów z widocznym tekstem i przyciskiem Wyczyść,
- wyszukiwanie produktów podczas dodawania składników przepisu,
- wyszukiwanie przepisów podczas dodawania posiłku do planu.

## Jednostki domowe
Produkty mają jednostkę bazową `g` lub `ml` oraz opcjonalne przeliczniki dla: sztuki, kromki, szklanki, łyżki, łyżeczki, garści, plastra i opakowania. W przepisie można wybrać tylko jednostki skonfigurowane dla danego produktu. Aplikacja przelicza je na g/ml do obliczeń wartości odżywczych i generowania koszyka.

## Liczba porcji w planie diety

Podczas dodawania lub edycji posiłku można ustawić liczbę porcji (np. 0,5; 1; 1,5; 2). Liczba porcji jest uwzględniana w:
- podsumowaniu kalorii i makroskładników dnia,
- szczegółach składników posiłku,
- generowaniu koszyka zakupowego,
- eksporcie i imporcie arkusza `Plan_diety` w kolumnie `Liczba_porcji`.


## Sugerowane godziny posiłków

W formularzu dodawania posiłku godzina jest podpowiadana na podstawie typu: śniadanie 08:00, II śniadanie 11:00, obiad 15:00, podwieczorek 17:30, kolacja 20:00, przekąska 13:00, inne 12:00. Godzinę można zawsze zmienić ręcznie. Podczas edycji istniejącego posiłku jego zapisana godzina pozostaje bez zmian.


## Eksport PDF
W zakładce Plan lub Dane wybierz **Eksportuj PDF**. Wskaż zakres dat. Aplikacja otworzy poziomy podgląd A4: jeden dzień na stronę, posiłki w kolumnach. W oknie drukowania wybierz **Zapisz jako PDF**.


## Kopiowanie poprzedniego dnia
W zakładce Plan diety użyj przycisku **Skopiuj poprzedni dzień**, wybierz dzień docelowy, a aplikacja skopiuje wszystkie posiłki z dnia wcześniejszego wraz z godzinami, przepisami i liczbą porcji.
