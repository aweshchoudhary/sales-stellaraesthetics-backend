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
app.get("/:id", getOne);
app.put("/:id", updateOne);
app.delete("/:id", deleteOne);

app.post("/assign-user/:id", checkPipelineOwnerAccess, assignUserToPipeline);
app.post("/remove-user/:id", checkPipelineOwnerAccess, removeUserFromPipeline);
app.post(
  "/change-ownership/:id",
  checkPipelineOwnerAccess,
  changeOwnershipOfPipeline
);

export default app;
