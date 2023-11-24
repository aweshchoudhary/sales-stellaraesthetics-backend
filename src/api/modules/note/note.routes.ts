import { Router } from "express";
import { create, deleteOne, getMany, getOne, updateOne } from "./note.handlers";

const app = Router();

app.post("/", create);
app.get("/", getMany);
app.get("/:id", getOne);
app.put("/:id", updateOne);
app.delete("/:id", deleteOne);

export default app;
