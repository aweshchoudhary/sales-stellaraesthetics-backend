import { Router } from "express";
import {
  create,
  deleteOne,
  getMany,
  getOne,
  updateOne,
} from "./contact.handlers";
import validate from "../../common/validate.schema";
import { contactCreateSchema, contactUpdateSchema } from "./contact.util";

const app = Router();

app.post("/", validate(contactCreateSchema), create);
app.get("/", getMany);
app.get("/:id", getOne);
app.put("/:id", validate(contactUpdateSchema), updateOne);
app.delete("/:id", deleteOne);

export default app;
