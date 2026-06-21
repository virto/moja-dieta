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

## Rozszerzenia v14
- cele kalorii i makroskładników z paskami realizacji,
- ostrzeżenia planu,
- widok tygodniowy i kopiowanie poprzedniego tygodnia,
- szablony dni,
- ulubione, tagi, czas, trudność i notatki przepisów,
- produkty „mam w domu”, wielkości i ceny opakowań,
- wykres masy ciała,
- personalizowane godziny posiłków,
- jasny/ciemny/systemowy wygląd,
- 5 automatycznych kopii danych,
- wykrywanie jednoczesnej edycji na innym urządzeniu.

## Poprawka v15 – zapis danych

Zapis nie nadpisuje już jednego publicznego pliku Blob. Każda operacja tworzy unikalną wersję JSON, a API pobiera najnowszą wersję. Eliminuje to fałszywe konflikty powodowane przez pamięć podręczną Vercel Blob. Aplikacja zachowuje maksymalnie 50 technicznych wersji pliku oraz nadal obsługuje starszy plik `diet-app/diet-data.json`.


## Wersja 16 – usuwanie całego koszyka

W zakładce Koszyk dodano przycisk „Usuń cały koszyk” z potwierdzeniem i informacją o liczbie usuwanych pozycji.


## Wersja v17

- rozbudowany widok tygodniowy z nawigacją, sumami dnia i szybkim dodawaniem/edycją,
- kopiowanie dnia na wiele dat i poprzedniego tygodnia,
- duplikowanie przepisów,
- cofanie usunięcia przez 7 sekund,
- koszyk pokazuje liczbę opakowań, nadwyżkę i szacowany koszt.

## Wersja v18
- usuwanie pojedynczych posiłków bezpośrednio w widoku tygodniowym,
- usuwanie wszystkich posiłków z wybranego dnia,
- potwierdzenie przed usunięciem całego dnia,
- możliwość cofnięcia obu operacji przez 7 sekund.


## Wersja v19
- Naprawiono utratę focusu w wyszukiwarce przepisów podczas wpisywania kolejnych znaków.


## Wersja v20 — przebudowa UI/UX
- dolna nawigacja mobilna i panel Więcej
- nowy ekran Start skoncentrowany na dzisiejszym planie
- pionowy widok tygodnia na telefonie
- menu akcji zamiast wielu ikon
- własne dialogi dla najważniejszych operacji
- uporządkowana sekcja Ustawienia


## Wersja v21 — naprawa uruchamiania

- przywrócono funkcje openModal i closeModal,
- przywrócono renderowanie Produktów, Przepisów, Planu, Koszyka, Pomiarów i Ustawień,
- naprawiono zatrzymanie aplikacji na komunikacie „Łączenie z plikiem online…”,
- cache PWA: moja-dieta-v21.

## Wersja v22 — UI/UX priorytet 2
- wieloetapowy formularz przepisu,
- uproszczone wiersze składników i bieżące przeliczenia,
- automatyczny lokalny zapis szkicu,
- ostrzeżenie przed zamknięciem niezapisanej edycji,
- walidacja z komunikatami bezpośrednio przy polach.

## Wersja v23 – UI/UX priorytet 3

- spójna skala typografii i rytm odstępów,
- większe pola i przyciski dotykowe (minimum 44 px),
- ujednolicone ikony edycji i usuwania z etykietami dostępności,
- poprawiony kontrast tekstów i stanów ostrzegawczych,
- wyraźny focus klawiatury oraz link „Przejdź do treści”,
- komunikaty statusu z `aria-live`,
- ulepszone stany puste z jasnym kolejnym krokiem,
- wsparcie `prefers-reduced-motion`.
