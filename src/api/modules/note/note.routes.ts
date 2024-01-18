import { Router } from "express";
import { create, deleteOne, getMany, getOne, updateOne } from "./note.handlers";
import validate from "../../common/validate.schema";
import { noteCreateSchema, noteUpdateSchema } from "./note.util";

const app = Router();

app.post("/", validate(noteCreateSchema), create);
app.get("/", getMany);
app.get("/:id", getOne);
app.put("/:id", validate(noteUpdateSchema), updateOne);
app.delete("/:id", deleteOne);

export default app;
