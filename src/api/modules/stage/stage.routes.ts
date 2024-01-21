import { Router } from "express";
import {
  create,
  deleteOne,
  getMany,
  getManyByPipelineId,
  getOne,
  reorderStages,
  updateOne,
} from "./stage.handlers";
import { checkPipelineAccess } from "../pipeline/pipeline.middleware";

const app = Router();

app.post("/", checkPipelineAccess, create);
app.get("/", getMany);
app.get("/:id", getOne);
app.put("/:id", checkPipelineAccess, updateOne);
app.delete("/:id", checkPipelineAccess, deleteOne);
app.get("/pipeline/:pipelineId", getManyByPipelineId);
app.put("/reorder/:pipelineId", checkPipelineAccess, reorderStages);

export default app;
