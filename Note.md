## Flusso di funzionamento (senza backend)

**Sezione 1: Ora + Meteo**

- L’utente seleziona una o più città dal `<select multiple>.`
- Clicca il bottone Aggiorna.
- Il codice legge le città selezionate (selectedOptions) e crea due contenitori pre per ciascuna città:
- - uno per l’ora locale
- - uno per il meteo
- Per ciascuna città, fa due chiamate API pubbliche:
- - WorldTimeAPI per l’ora locale
- - Open-Meteo per il meteo
- Quando arrivano i dati:
- - vengono formattati in JSON leggibile (pretty) e mostrati nell’output div corrispondente.
- - vengono aggiunti in una lista storica (ul) gli ultimi 5 risultati
- Se c’è un errore in una chiamata (es. timeout, codice HTTP diverso da 200):
- - viene mostrato nel div corrispondente
- - viene mostrato un toast rosso con messaggio di errore

Tutto questo si svolge direttamente dal browser.

---

**Sezione 2: Echo Playground**

- L’utente scrive un testo nell’input e preme Invia.
- Il browser fa una chiamata a https://httpbin.org/get?text=….
- La risposta (args e origin) viene mostrata nel div di output.
- L’ultimo testo inviato viene aggiunto alla lista storica degli ultimi 5 invii.
- Se c’è un errore di rete o risposta non valida, viene mostrato un toast di errore.

---

**Sezione 3: Post finti**

- L’utente scrive titolo e contenuto e preme Crea post.
- Il browser fa una richiesta POST a https://jsonplaceholder.typicode.com/posts (API finta).
- La risposta JSON viene mostrata nel container dei post (posts-list).
- La lista storica dei post può essere caricata cliccando Carica lista post, che fa una chiamata GET all’API.
- Tutto avviene senza un backend difatti i post non vengono salvati realmente su un database e ad ogni refresh della pagina resetta tutto tranne lo storico visualizzato in sessione

---

Se ci fosse un backend il flusso sarebbe il seguente:

**Flusso ora/meteo**
Il browser potrebbe inviare solo una richiesta al backend indicando le città selezionate.
Il backend:

- Chiama le API esterne (WorldTimeAPI e Open-Meteo),
- Aggrega i dati in un unico JSON,
- Li restituisce al client.

In questa maniera si ha maggiore sicurezza (chiavi API nascoste nel server), la possibilità di cache dei dati per ridurre le chiamate esterne e la possibilità di avere dei logs e un monitoraggio degli errori.

**Flusso Echo**
Il testo dell’utente verrebbe inviato al backend, questo potrebbe fare l’echo direttamente o aggiungere elaborazioni (es. filtri, log, salvataggio).
Per garantire maggiore sicurezza si può aggiungere l'autenticazione o delle limitazioni attraverso per es. il rate limit, inoltre si possono salvare gli echo inviati dagli utenti nel database.

**Flusso Post**
Il POST verrebbe inviato al backend questo salverebbe i post in un database come per es PostgreSQL, MySQL. I metodi GET e POST diventerebbero persistenti,
i dati rimarrebbero anche dopo il refresh della pagina ed infine vi è la possibilità di fare autenticazione e gestione utenti (es. userId reale).

Il progetto è stato testato su vari browser (Safari, Chromiun, Chrom, Firefox)ma l'unico in cui è risultato funzionante al 100% è Firefox.
