import { Router } from "express";
import { generateAPIKey, deleteAPIKey } from "./auth.handlers";

const app = Router();

app.post("/:userId/api-key/generate", generateAPIKey);
app.post("/:userId/api-key/delete", deleteAPIKey);

export default app;
