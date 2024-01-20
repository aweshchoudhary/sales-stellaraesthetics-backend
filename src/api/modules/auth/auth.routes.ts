import { Router } from "express";
import {
  generateAPIKey,
  deleteAPIKey,
  getLoggedUserDetails,
} from "./auth.handlers";

const app = Router();

app.get("/me", getLoggedUserDetails);
app.post("/:userId/api-key/generate", generateAPIKey);
app.post("/:userId/api-key/delete", deleteAPIKey);

export default app;
