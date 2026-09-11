/**
 * Riceve le risposte RSVP dal sito e le aggiunge come riga al Google
 * Sheet indicato da SHEET_ID. Nessuna email viene inviata: le risposte
 * vivono solo nel foglio. Vedi SETUP.md per le istruzioni di installazione.
 *
 * Questo script è standalone (non "legato" al foglio tramite il menu
 * Estensioni > Apps Script), quindi usa SpreadsheetApp.openById invece
 * di getActiveSpreadsheet.
 */
const SHEET_ID = "1RC_2zvzRObUtlUj0Ok9a6wqtc0mXMhheeQSPZkiff78";

function doPost(e) {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Data invio", "Nome", "Cognome", "Email", "Partecipa",
      "N. persone", "Bambini", "Allergie", "Note", "Lingua"
    ]);
  }

  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.firstname || "",
    data.lastname || "",
    data.email || "",
    data.attending || "",
    data.guests || "",
    data.children || "",
    data.allergies || "",
    data.notes || "",
    data.language || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
