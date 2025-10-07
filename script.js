// Configurazione città: oggetti con nome, timezone e coordinate geografiche
const CITIES = {
  rome: { label: "Roma", tz: "Europe/Rome", lat: 41.9028, lon: 12.4964 },
  london: { label: "Londra", tz: "Europe/London", lat: 51.5072, lon: -0.1276 },
  newyork: {
    label: "New York",
    tz: "America/New_York",
    lat: 40.7128,
    lon: -74.006,
  },
  paris: { label: "Parigi", tz: "Europe/Paris", lat: 48.8566, lon: 2.3522 },
  tokyo: { label: "Tokyo", tz: "Asia/Tokyo", lat: 35.6762, lon: 139.6503 },
};

// Utility: selettore rapido tipo jQuery
const $ = (sel) => document.querySelector(sel);

// Crea un div `pre` per mostrare output in una sezione
const createOutputDiv = (parent, id) => {
  const el = document.createElement("pre"); // crea l'elemento
  el.id = id; // assegna un id unico
  el.className = "output muted"; // classe CSS iniziale
  el.textContent = "Carico…"; // testo iniziale
  parent.appendChild(el); // lo aggiunge al contenitore
  return el; // ritorna l'elemento per uso futuro
};

// Imposta il contenuto e la classe di un output div
const setOut = (el, msg, cls = "") => {
  el.className = "output " + cls; // aggiorna la classe (success, error, muted)
  el.textContent = msg; // aggiorna il testo
};

// Trasforma un oggetto JS in stringa JSON leggibile
const pretty = (obj) => JSON.stringify(obj, null, 2);

// Mostra un messaggio di caricamento con spinner
const showLoading = (el, msg = "Carico…") => {
  el.className = "output muted"; // classe muted
  el.textContent = msg; // testo di caricamento
  const spinner = document.createElement("span"); // crea spinner
  spinner.className = "spinner"; // classe CSS spinner
  el.appendChild(spinner); // aggiunge lo spinner al div
};

// Mostra un toast temporaneo (messaggio popup)
const toast = (msg, type = "info") => {
  const t = $("#toast"); // seleziona il div toast
  t.textContent = msg; // imposta il testo
  t.classList.add("show"); // mostra il toast
  if (type === "error") t.classList.add("error"); // classe colore rosso se errore
  setTimeout(() => t.classList.remove("show", "error"), 2500); // scompare dopo 2,5s
};

// Dark mode: toggle classe light sul body
$("#dark-mode-toggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
});

// Sezione 1: Ora + Meteo
$("#btn-refresh").addEventListener("click", async () => {
  const selected = Array.from($("#city").selectedOptions).map(
    (opt) => opt.value
  );
  // Se non c'è nessuna città selezionata, mostra errore
  if (!selected.length) return toast("Seleziona almeno una città", "error");

  const timeContainer = $("#time-container"); // container ora
  const weatherContainer = $("#weather-container"); // container meteo
  timeContainer.innerHTML = ""; // reset output precedente
  weatherContainer.innerHTML = "";

  // Carica ora e meteo per tutte le città selezionate in parallelo
  await Promise.all(
    selected.map(async (key) => {
      const city = CITIES[key]; // dati città
      const timeOut = createOutputDiv(timeContainer, `time-${key}`); // crea output ora
      const weatherOut = createOutputDiv(weatherContainer, `weather-${key}`); // crea output meteo

      await loadTime(city, timeOut); // carica ora
      await loadWeather(city, weatherOut); // carica meteo
    })
  );
});

// Funzione per caricare ora locale
async function loadTime(city, out) {
  showLoading(out, "Carico ora locale…"); // messaggio caricamento
  try {
    const res = await fetch(`https://worldtimeapi.org/api/timezone/${city.tz}`); // API WorldTime
    if (!res.ok) throw new Error(`HTTP ${res.status}`); // errore HTTP
    const data = await res.json(); // parse JSON

    const view = { timezone: data.timezone, datetime: data.datetime }; // crea oggetto per output
    setOut(out, pretty(view), "success"); // mostra in output div

    // aggiunge all'ul storico le ultime 5 richieste
    const li = document.createElement("li");
    li.textContent = `${city.label}: ${new Date(data.datetime).toLocaleTimeString()}`;
    const ul = $("#history-time");
    ul.prepend(li);
    if (ul.children.length > 5) ul.removeChild(ul.lastChild);
  } catch (err) {
    setOut(out, "Errore: " + (err?.message || err), "error"); // output errore
    toast(`Errore caricamento ora: ${city.label}`, "error");
  }
}

// Funzione per caricare meteo
async function loadWeather(city, out) {
  showLoading(out, "Carico meteo…"); // messaggio caricamento
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast"); // API Open-Meteo
    url.searchParams.set("latitude", city.lat);
    url.searchParams.set("longitude", city.lon);
    url.searchParams.set("current_weather", "true");

    const res = await fetch(url.toString()); // fetch API
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json(); // parse JSON

    const temp = data.current_weather?.temperature ?? "N/A"; // fallback se mancante
    const code = data.current_weather?.weathercode ?? -1;
    const view = { temperature_c: temp, description: weatherDescription(code) }; // oggetto output
    setOut(out, pretty(view), "success");

    // aggiunge all'ul storico le ultime 5 richieste
    const li = document.createElement("li");
    li.textContent = `${city.label}: ${view.temperature_c}°C - ${view.description}`;
    const ul = $("#history-weather");
    ul.prepend(li);
    if (ul.children.length > 5) ul.removeChild(ul.lastChild);
  } catch (err) {
    setOut(out, "Errore: " + (err?.message || err), "error");
    toast(`Errore caricamento meteo: ${city.label}`, "error");
  }
}

// Mappa codici meteo in descrizioni leggibili
function weatherDescription(code) {
  const MAP = {
    0: "Sereno",
    1: "Perlopiù sereno",
    2: "Parzialmente nuvoloso",
    3: "Nuvoloso",
    45: "Nebbia",
    48: "Nebbia gelata",
    51: "Pioviggine debole",
    53: "Pioviggine",
    55: "Pioviggine intensa",
    61: "Pioggia debole",
    63: "Pioggia",
    65: "Pioggia forte",
    71: "Neve debole",
    73: "Neve",
    75: "Neve intensa",
    80: "Rovesci deboli",
    81: "Rovesci",
    82: "Rovesci forti",
    95: "Temporale",
  };
  return MAP[code] ?? "Condizione sconosciuta"; // fallback se codice sconosciuto
}

// Sezione 2: Echo Playground
$("#echo-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // previene submit default
  const out = $("#echo-out");
  const text = $("#echo-input").value.trim(); // testo input
  if (!text)
    return setOut(out, "Inserisci un testo prima di inviare.", "error");
  showLoading(out, "Invio…");

  try {
    const res = await fetch(
      `https://httpbin.org/get?text=${encodeURIComponent(text)}`
    ); // API echo
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    setOut(
      out,
      pretty({ received: data.args, origin: data.origin }),
      "success"
    ); // mostra risposta

    // aggiunge storico degli ultimi 5 echo
    const li = document.createElement("li");
    li.textContent = text;
    const ul = $("#history-echo");
    ul.prepend(li);
    if (ul.children.length > 5) ul.removeChild(ul.lastChild);

    toast("Echo ricevuto", "info"); // toast conferma
  } catch (err) {
    setOut(out, "Errore: " + (err?.message || err), "error");
    toast("Errore Echo", "error");
  }
});

// Sezione 3: Post finti
$("#post-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // previene submit default
  const title = $("#post-title").value.trim();
  const body = $("#post-body").value.trim();
  const out = $("#posts-list");
  if (!title || !body) return toast("Compila titolo e contenuto", "error");
  showLoading(out, "Invio post…");

  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({ title, body, userId: 1 }), // payload JSON
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    displayPosts([data], true); // mostra post inviato
    $("#post-title").value = "";
    $("#post-body").value = "";
    toast("Post inviato con successo", "info");
  } catch {
    toast("Errore post", "error");
  }
});

// Bottone carica lista post
$("#btn-load-posts").addEventListener("click", async () => {
  const out = $("#posts-list");
  showLoading(out, "Carico post…");
  try {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/posts?userId=1"
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    displayPosts(data.slice(0, 5)); // mostra solo primi 5
    toast("Post caricati", "info");
  } catch {
    toast("Errore caricamento post", "error");
  }
});

// Funzione per visualizzare i post in lista
function displayPosts(posts, prepend = false) {
  const container = $("#posts-list");
  if (!prepend) container.innerHTML = ""; // reset se append normale
  posts.forEach((p) => {
    const div = document.createElement("div");
    div.className = "post-card";
    div.innerHTML = `<strong>${p.title}</strong><p>${p.body || "Nessun contenuto"}</p><small>ID: ${p.id}</small>`;
    prepend ? container.prepend(div) : container.appendChild(div); // prepend o append
  });
}
