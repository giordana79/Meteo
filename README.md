# Progetto: "Hello Backend (senza backend)"
**Stack:** HTML, CSS, JavaScript (vanilla) — nessun server da installare.
**Goal:** capire come il frontend dialoga con *un backend* usando API pubbliche con CORS.

## Cosa costruirai
Una **mini dashboard** che mostra:
1. **Ora della città** scelta (via WorldTimeAPI)
2. **Meteo attuale** della città (via Open-Meteo, senza API key)
3. **Echo Playground** (httpbin.org) per vedere i parametri inviati
4. **Post finti** (JSONPlaceholder): creazione via POST e lista via GET

> Tutto in una singola pagina, curando stati: *loading*, *success*, *error*.

## User Stories (base)
- Come utente, voglio selezionare una città e vedere **ora** e **meteo attuale**.
- Come utente, voglio inviare un **testo di prova** e vedere cosa riceve il server (echo).
- Come utente, voglio **creare un post finto** e vedere una **lista di post**.

## Accettazione (criteri)
- Vedo **loading** chiaro durante ogni richiesta.
- Gli **errori** sono comprensibili (non solo console).
- I JSON sono **ridotti** ai campi importanti (es. temp°, condizione, ora locale).
- Il codice è **commentato** dove avviene `fetch` e gestione degli stati.

## Endpoint usati
- Ora locale (per città predefinite): `https://worldtimeapi.org/api/timezone/{TZ}`
- Meteo attuale: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,weather_code`
- Echo: `https://httpbin.org/get?text=...`
- Post finti (lista/crea): `https://jsonplaceholder.typicode.com/posts`

## Città disponibili (hardcoded)
- Rome — TZ: `Europe/Rome`, lat: 41.9028, lon: 12.4964
- London — TZ: `Europe/London`, lat: 51.5072, lon: -0.1276
- New York — TZ: `America/New_York`, lat: 40.7128, lon: -74.0060

## Estensioni (opzionali)
- Spinner animato al posto del testo "Carico…".
- Messaggi di successo/errore con toast.
- Salvataggio delle ultime 5 risposte in memoria (array) e visualizzazione cronologia.
- Card grafiche per i post.
- Dark Mode toggle.

## Valutazione suggerita
- Funzionalità (40%) — tutte le sezioni funzionano, stati gestiti.
- Qualità del codice (30%) — struttura, commenti, funzioni riutilizzabili.
- UI/UX (20%) — chiarezza, leggibilità, feedback utente.
- Extra (10%) — almeno una estensione.

## Avvio
Apri `index.html` in un browser (consigliato VS Code + estensione Live Server).
