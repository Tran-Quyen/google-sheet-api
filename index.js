const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const auth = new google.auth.GoogleAuth({
 keyFile: "credentials.json",
 scopes: "https://www.googleapis.com/auth/spreadsheets",
});
app.get("/", async (req, res) => {
 // Create client instance for auth
 const client = await auth.getClient();
 // Instance of Google Sheets API
 const googleSheets = google.sheets({ version: "v4", auth: client });
 const spreadsheetId = req.query.id;
 // Get metadata about spreadsheet
 const metaData = await googleSheets.spreadsheets.get({
  auth,
  spreadsheetId,
 });
 res.status(200).send(metaData.data.sheets);
});
app.get("/sheets", async (req, res) => {
 const spreadsheetId = req.query.id;
 // Create client instance for auth
 const client = await auth.getClient();
 // Instance of Google Sheets API
 const googleSheets = google.sheets({ version: "v4", auth: client });
 // Read rows from spreadsheet
 const getRows = await googleSheets.spreadsheets.values.get({
  auth,
  spreadsheetId,
  range: req.query.sheets,
 });
 res.status(200).send(getRows.data);
});

app.listen(process.env.PORT || 5000, function () {
 console.log(
  "Express server listening on port %d in %s mode",
  this.address().port,
  app.settings.env
 );
});
