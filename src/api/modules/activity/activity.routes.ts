import { Router } from "express";
import {
  create,
  deleteOne,
  getMany,
  getManyDealId,
  getOne,
  updateOne,
} from "./activity.handlers";
import { verifyActivityAccess } from "./activity.middlewares";

const app = Router();

app.post("/", create);
app.get("/", getMany);
app.get("/deal/:dealId", getManyDealId);
app.get("/:id", getOne);
app.put("/:id", updateOne);
app.delete("/:id", verifyActivityAccess, deleteOne);

export default app;
