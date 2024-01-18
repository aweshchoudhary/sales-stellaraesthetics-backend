import { Router } from "express";
import { create, deleteOne, getMany, getOne, updateOne } from "./user.handlers";
import validate from "../../common/validate.schema";
import { userCreateSchema, userUpdateSchema } from "./user.util";

const app = Router();

app.post("/", validate(userCreateSchema), create);
app.get("/", getMany);
app.get("/:id", getOne);
app.put("/:id", validate(userUpdateSchema), updateOne);
app.delete("/:id", deleteOne);

export default app;
