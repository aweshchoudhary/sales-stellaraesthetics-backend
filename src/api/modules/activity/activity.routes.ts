import { Router } from "express";
import {
  create,
  deleteOne,
  getMany,
  getOne,
  updateOne,
} from "./activity.handlers";
import { verifyActivityAccess } from "../../middlewares/activity.middlewares";

const app = Router();

app.post("/", create);
app.get("/", getMany);
app.get("/:id", getOne);
app.put("/:id", verifyActivityAccess, updateOne);
app.delete("/:id", verifyActivityAccess, deleteOne);

export default app;
