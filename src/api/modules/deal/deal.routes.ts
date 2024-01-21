import { Router } from "express";
import {
  create,
  deleteOne,
  getMany,
  getManyByStageId,
  getOne,
  updateOne,
} from "./deal.handlers";
import { checkPipelineAccess } from "../pipeline/pipeline.middleware";
import validate from "../../common/validate.schema";
import { dealCreateSchema, dealUpdateSchema } from "./deal.util";

const app = Router();

app.post("/", validate(dealCreateSchema), checkPipelineAccess, create);
app.get("/", getMany);
app.get("/stage/:stageId", getManyByStageId);
app.get("/:id", getOne);
app.put("/:id", validate(dealUpdateSchema), checkPipelineAccess, updateOne);
app.delete("/:id", checkPipelineAccess, deleteOne);

export default app;
