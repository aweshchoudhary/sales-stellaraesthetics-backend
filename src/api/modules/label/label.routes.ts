import { Router } from "express";
import {
  create,
  deleteOne,
  getMany,
  getOne,
  updateOne,
  getManyPipelineId,
} from "./label.handlers";
import validate from "../../common/validate.schema";
import { labelCreateSchema, labelUpdateSchema } from "./label.util";

const app = Router();

app.post("/", validate(labelCreateSchema), create);
app.get("/", getMany);
app.get("/pipeline/:pipelineId", getManyPipelineId);
app.get("/:id", getOne);
app.put("/:id", validate(labelUpdateSchema), updateOne);
app.delete("/:id", deleteOne);

export default app;
