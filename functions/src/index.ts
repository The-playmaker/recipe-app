import * as functions from "firebase-functions";
import { google } from "googleapis";

// Lim inn innholdet fra JSON-nøkkelfilen du lastet ned
const serviceAccount = require("./service.json");

// ID-en til ditt Google Sheet (fra URL-en)
const SPREADSHEET_ID = "1Ys4k7e1UyXBGkRUow32Ck0FnCrkg59AneeG5JHKNOB0";

// Konfigurer en klient for Google Sheets API
const sheetsClient = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth: sheetsClient });

// Denne funksjonen kjører hver gang et nytt dokument lages i 'drinks'
export const onRecipeCreate = functions.firestore
  .document("drinks/{drinkId}")
  .onCreate(async (snap, context) => {
    const newRecipe = snap.data();
    const drinkId = context.params.drinkId;

    // Formater dataen til en rad som passer arket ditt
    const rowData = [
      drinkId,
      newRecipe.name || "",
      newRecipe.category || "",
      newRecipe.difficulty || "",
      newRecipe.time || "",
      newRecipe.image || "",
      newRecipe.description || "",
      (newRecipe.ingredients || []).join(", "), // Gjør om array til tekst
      (newRecipe.instructions || []).join("\n"), // Gjør om array til tekst med linjeskift
      new Date().toISOString(),
    ];

    try {
      // Legger til den nye raden i arket
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: "Sheet1!A1", // Start å lete etter tom rad fra A1
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [rowData],
        },
      });
      functions.logger.info("Successfully wrote to sheet:", newRecipe.name);
    } catch (err) {
      functions.logger.error("Error writing to sheet:", err);
    }
  });