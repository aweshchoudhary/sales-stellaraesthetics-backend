import { Router } from "express";
import { create, deleteOne, getMany, getOne, updateOne } from "./call.handlers";
import { verifyActivityAccess } from "./activity.middlewares";
import { activityCreateSchema, activityUpdateSchema } from "./activity.util";
import validate from "../../common/validate.schema";

const app = Router();

app.post("/", validate(activityCreateSchema), create);
app.get("/", getMany);
app.get("/:id", getOne);
app.put("/:id", validate(activityUpdateSchema), updateOne);
app.delete("/:id", verifyActivityAccess, deleteOne);

export default app;
