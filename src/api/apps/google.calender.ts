// import { google } from "googleapis";
// import path from "path";
// import credentials from "../../../credentials.json";

// const SCOPES = "https://www.googleapis.com/auth/calendar.events";
// const GOOGLE_PRIVATE_KEY = credentials.private_key;
// const GOOGLE_CLIENT_EMAIL = credentials.client_email;
// const GOOGLE_PROJECT_NUMBER = credentials.project_id;
// const GOOGLE_CALENDAR_ID = credentials.calendar_id;

// const jwtClient = new google.auth.JWT(
//   GOOGLE_CLIENT_EMAIL,
//   undefined,
//   GOOGLE_PRIVATE_KEY,
//   SCOPES
// );

// const calendar = google.calendar({
//   version: "v3",
//   project: GOOGLE_PROJECT_NUMBER,
//   auth: jwtClient,
// });
// const new calendar = google.calendar({
//     version: "v3",

// })

// const calendarAuth = new google.auth.GoogleAuth({
//   keyFile: path.join(__dirname, "credentials.json"),
//   scopes: "https://www.googleapis.com/auth/calendar",
// });

// module.exports = {
//   calendar,
//   GOOGLE_CALENDAR_ID,
//   calendarAuth,
// };
