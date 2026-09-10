/**
 * Riceve le risposte RSVP dal sito e le aggiunge come riga a questo
 * Google Sheet. Nessuna email viene inviata: le risposte vivono solo
 * nel foglio. Vedi SETUP.md per le istruzioni di installazione.
 */
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

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
