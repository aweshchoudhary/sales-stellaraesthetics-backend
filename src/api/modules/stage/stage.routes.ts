import { Router } from "express";
import {
  create,
  deleteOne,
  getMany,
  getOne,
  reorderStages,
  updateOne,
} from "./stage.handlers";
import { checkPipelineAccess } from "../../middlewares/pipeline.middleware";

const app = Router();

app.post("/", checkPipelineAccess, create);
app.get("/", getMany);
app.get("/:id", getOne);
app.put("/:id", checkPipelineAccess, updateOne);
app.delete("/:id", checkPipelineAccess, deleteOne);
app.put("/reorder/:pipelineId", checkPipelineAccess, reorderStages);

export default app;
