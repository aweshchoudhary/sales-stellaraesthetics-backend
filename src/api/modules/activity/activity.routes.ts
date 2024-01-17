import { Router } from "express";
import {
  create,
  deleteOne,
  getMany,
  getOne,
  updateOne,
} from "./activity.handlers";
import { verifyActivityAccess } from "./activity.middlewares";
import { activityCreateSchema } from "./activity.util";
import validate from "../../common/validate.schema";

const app = Router();

app.post("/", validate(activityCreateSchema), create);
app.get("/", getMany);
app.get("/:id", getOne);
app.put("/:id", verifyActivityAccess, updateOne);
app.delete("/:id", verifyActivityAccess, deleteOne);

export default app;
