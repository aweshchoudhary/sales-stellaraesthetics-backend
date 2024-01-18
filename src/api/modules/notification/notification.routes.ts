import { Router } from "express";
import {
  create,
  readOne,
  getMany,
  getOne,
  readMany,
} from "./notifcation.handlers";

const app = Router();

app.post("/", create);
app.get("/", getMany);
app.get("/:id", getOne);
app.put("/read/:id/", readOne);
app.delete("/read-many/:id", readMany);

export default app;
