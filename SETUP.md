# Setup del sito — Domenica & Antonio

## 1. Collegare l'RSVP a Google Sheet (5 minuti)

1. Vai su [sheets.google.com](https://sheets.google.com) e crea un nuovo foglio, chiamalo ad esempio **"RSVP Matrimonio"**.
2. Nel foglio, apri **Estensioni → Apps Script**.
3. Cancella il codice di esempio e incolla il contenuto del file [`apps-script/Code.gs`](apps-script/Code.gs) di questo progetto.
4. Salva (icona del dischetto), dai un nome al progetto (es. "RSVP backend").
5. In alto a destra clicca **Esegui la distribuzione → Nuova distribuzione**.
   - Tipo: **Web app**
   - Descrizione: "RSVP matrimonio"
   - Esegui come: **Me**
   - Chi ha accesso: **Chiunque** (necessario perché gli invitati non hanno un account Google)
6. Clicca **Esegui la distribuzione**. Google chiederà di autorizzare lo script: accetta (vedrai un avviso "app non verificata", è normale perché è uno script tuo — clicca "Avanzate" → "Vai al progetto (non sicuro)" → Consenti).
7. Copia l'**URL della web app** che ti viene mostrato (finisce con `/exec`).
8. Apri il file [`js/config.js`](js/config.js) di questo progetto e incolla l'URL:
   ```js
   const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/XXXXX/exec";
   ```
9. Salva, ricarica il sito e prova a inviare una risposta di prova dal form RSVP: dovrebbe comparire come nuova riga nel foglio Google.

Nessuna email viene inviata — le risposte arrivano solo nel foglio. Puoi rinominare/riordinare le colonne del foglio quando vuoi, l'intestazione viene scritta automaticamente alla prima risposta.

Se in futuro vuoi ricevere comunque una notifica per ogni nuova risposta, puoi attivarla direttamente da Google Sheets: **Strumenti → Regole di notifica**.

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
