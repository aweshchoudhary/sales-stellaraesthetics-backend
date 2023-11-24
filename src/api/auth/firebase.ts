import admin, { ServiceAccount } from "firebase-admin";

const serviceAccount: ServiceAccount = require("../utils/servicekey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
