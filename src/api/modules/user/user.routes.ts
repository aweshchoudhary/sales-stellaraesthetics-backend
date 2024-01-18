import { Router } from "express";
import {
  create,
  deleteAPIKey,
  deleteOne,
  generateAPIKey,
  getMany,
  getOne,
  updateOne,
} from "./user.handlers";
import validate from "../../common/validate.schema";
import { userCreateSchema, userUpdateSchema } from "./user.util";

const app = Router();

app.post("/", validate(userCreateSchema), create);
app.get("/", getMany);
app.get("/:id", getOne);
app.put("/:id", validate(userUpdateSchema), updateOne);
app.delete("/:id", deleteOne);
app.post("/:userId/api-key/generate", generateAPIKey);
app.post("/:userId/api-key/delete", deleteAPIKey);

export default app;
