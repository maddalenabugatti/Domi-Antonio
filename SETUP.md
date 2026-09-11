# Setup del sito — Domenica & Antonio

## 1. RSVP → Google Sheet — ✅ già configurato

Il form RSVP scrive già nel foglio Google:
[Invitati matrimonio](https://docs.google.com/spreadsheets/d/1RC_2zvzRObUtlUj0Ok9a6wqtc0mXMhheeQSPZkiff78/edit)

Come funziona: lo script `apps-script/Code.gs` è pubblicato come Web App standalone (progetto "RSVP Matrimonio Domenica e Antonio" nel tuo account Google, accesso "Chiunque", esecuzione "Me"), e il suo URL `/exec` è già incollato in `js/config.js`. Nessuna email viene inviata — le risposte arrivano solo come nuova riga nel foglio, con intestazione scritta automaticamente alla prima risposta.

Se in futuro vuoi comunque una notifica per ogni nuova risposta, puoi attivarla direttamente dal foglio: **Strumenti → Regole di notifica**.

Se un giorno serve rifare il deployment da zero (es. per cambiare foglio), i passaggi sono:
1. [script.google.com](https://script.google.com) → apri il progetto → **Esegui il deployment → Gestisci deployment** → icona matita → **Nuova versione** → Esegui il deployment.
2. Copia il nuovo URL `/exec` e incollalo in [`js/config.js`](js/config.js) al posto di quello esistente.

## 2. Pubblicare su GitHub Pages

Se il sito è già in un repository GitHub:

```bash
git add .
git commit -m "Aggiorna sito matrimonio"
git push
```

Poi su GitHub: **Settings → Pages → Branch: main → Save**. Il sito sarà online su `https://<utente>.github.io/<nome-repo>/` in un paio di minuti.

## 3. Modificare i testi

- Testi in italiano e spagnolo: [`js/i18n.js`](js/i18n.js) — ogni riga è `"chiave": "testo"`.
- Data del matrimonio (countdown e calendario): [`js/main.js`](js/main.js), variabile `WEDDING_DATE` in cima al file.
- Colori: [`css/style.css`](css/style.css), variabili all'inizio del file (sezione `:root`).
