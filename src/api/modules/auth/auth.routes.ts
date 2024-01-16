import { Router } from "express";
import { registerUser, login, passswordChange } from "./auth.handlers";
import { checkPipelineOwnerAccess } from "./pipeline.middleware";

const app = Router();

app.post("/register", registerUser);
app.post("/login", login);
app.post("/password", getOne);

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
