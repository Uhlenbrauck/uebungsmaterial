# Notizbuch-Links für die Checkliste holen

Die Checkliste verlinkt Seiten im OneNote-Klassennotizbuch des Kurses (`notizbuch` in `thema.js`).
Die Links holt man mit dem **Graph Explorer** im Browser: ohne Installation, angemeldet mit dem Schulkonto.

**Nicht** über `…/onenote/pages` für die ganze Kursseite abfragen. Im Klassennotizbuch hat jeder Schüler
eigene Abschnitte, dann bricht die Abfrage mit Fehler 20266 ab („Anzahl maximaler Abschnitte überschritten“).
Deshalb nur die **_Inhaltsbibliothek** abfragen. Sie enthält außerdem keine Schülernamen.

## Vorgehen (3 Abfragen)

Graph Explorer: <https://developer.microsoft.com/graph/graph-explorer>, mit dem Schulkonto anmelden.
Methode `GET`, Version `v1.0`. Beim ersten Mal im Reiter **Modify permissions** bei
*Notes.Read.All* und *Sites.Read.All* auf **Consent** klicken. Der Reiter zeigt nur Berechtigungen zur gerade
eingetragenen Abfrage, also zuerst die Adresse eintragen.

### 1. ID der Kursseite (einmal pro Kurs)

Den Namen der Kursseite sieht man in der Adresszeile, wenn man das Notizbuch im Browser öffnet (Teil nach `/sites/`).

```
https://graph.microsoft.com/v1.0/sites/fbgschwerte.sharepoint.com:/sites/KURSSEITE?$select=id,displayName
```

Die Antwort enthält `"id": "fbgschwerte.sharepoint.com,…,…"`. Diesen ganzen Wert unten als `SITE-ID` einsetzen.
Die OneNote-Abfragen funktionieren nur mit dieser ID, nicht mit dem Namen (Fehler 20282).

### 2. Abschnitte der Inhaltsbibliothek

```
https://graph.microsoft.com/v1.0/sites/SITE-ID/onenote/sectionGroups?$filter=displayName eq '_Inhaltsbibliothek'&$select=displayName&$expand=sections($select=id,displayName)
```

### 3. Seiten eines Abschnitts (für jeden benötigten Abschnitt)

```
https://graph.microsoft.com/v1.0/sites/SITE-ID/onenote/sections/ABSCHNITT-ID/pages?$select=title,links&$top=100
```

Höchstens 100 Seiten pro Abfrage. Steht am Ende `@odata.nextLink`, auch diese Adresse abrufen.
Die Antworten (JSON) Claude geben bzw. in `thema.js` übernehmen.

## Übernahme in `thema.js`

```js
"notizbuch": [
  {
    "titel": "<title der Seite>",
    "onenote": "<links.oneNoteClientUrl.href>",   // öffnet die OneNote-App
    "web": "<links.oneNoteWebUrl.href>"            // öffnet OneNote im Browser
  }
]
```

Die Links funktionieren nur mit dem Schulkonto und nur für diesen Kurs. Für einen neuen Kurs müssen sie neu
geholt werden.

## Beispiel: Ma 10c 2026/27

- Kursseite `2026_27_10c_M_Uhl`
- SITE-ID `fbgschwerte.sharepoint.com,56d71155-8d70-4813-a75c-2e8e0a912337,63ccc56b-b9af-423a-bf7f-8c48f9f9e85f`
- Abschnitte der Inhaltsbibliothek:
  - 9.7 Daten und Wahrscheinlichkeit `1-614864cd-9a16-4f90-a8c6-d060a9a8d17c`
  - 10.1 Daten und Wahrscheinlichkeit `1-dfe7d91d-5c35-4609-b0e3-9532d5a8f4c0`
  - 10.2 Quadratische Gleichungen `1-cb5fe889-21b9-40c5-bff9-2b929b584923`

Für spätere Arbeiten desselben Kurses genügt deshalb Schritt 3. Bei einem neuen Abschnitt kommt Schritt 2 dazu.
