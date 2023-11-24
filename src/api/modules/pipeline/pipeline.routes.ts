import { Router } from "express";
import {
  assignUserToPipeline,
  changeOwnershipOfPipeline,
  create,
  deleteOne,
  getMany,
  getOne,
  removeUserFromPipeline,
  updateOne,
} from "./pipeline.handlers";
import { checkPipelineOwnerAccess } from "../../middlewares/pipeline.middleware";

const app = Router();

app.post("/", create);
app.get("/", getMany);
app.get("/:pipelineId", getOne);
app.put("/:pipelineId", updateOne);
app.delete("/:pipelineId", deleteOne);

app.post(
  "/assign-user/:pipelineId",
  checkPipelineOwnerAccess,
  assignUserToPipeline
);
app.post(
  "/remove-user/:pipelineId",
  checkPipelineOwnerAccess,
  removeUserFromPipeline
);
app.post(
  "/change-ownership/:pipelinId",
  checkPipelineOwnerAccess,
  changeOwnershipOfPipeline
);

export default app;
