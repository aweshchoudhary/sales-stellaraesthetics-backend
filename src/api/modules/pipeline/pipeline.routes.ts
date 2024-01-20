import { Router } from "express";
import {
  assignUserToPipeline,
  changeOwnershipOfPipeline,
  create,
  deleteOne,
  getMany,
  getOne,
  getPipelineTableDataByOwnerId,
  removeUserFromPipeline,
  updateOne,
} from "./pipeline.handlers";
import { checkPipelineOwnerAccess } from "./pipeline.middleware";
import validate from "../../common/validate.schema";
import {
  pipelineAssignUserSchema,
  pipelineChangeOwnershipSchema,
  pipelineCreateSchema,
  pipelineRemoveUserSchema,
  pipelineUpdateSchema,
} from "./pipeline.util";

const app = Router();

app.post("/", validate(pipelineCreateSchema), create);
app.get("/", getMany);
app.get("/my-pipelines", getPipelineTableDataByOwnerId);
app.get("/:pipelineId", getOne);
app.put(
  "/:pipelineId",
  validate(pipelineUpdateSchema),
  checkPipelineOwnerAccess,
  updateOne
);
app.delete("/:pipelineId", deleteOne);

app.post(
  "/assign-user/:pipelineId",
  validate(pipelineAssignUserSchema),
  checkPipelineOwnerAccess,
  assignUserToPipeline
);
app.post(
  "/remove-user/:pipelineId",
  validate(pipelineRemoveUserSchema),
  checkPipelineOwnerAccess,
  removeUserFromPipeline
);
app.post(
  "/change-ownership/:pipelineId",
  validate(pipelineChangeOwnershipSchema),
  checkPipelineOwnerAccess,
  changeOwnershipOfPipeline
);

export default app;
