import { Router } from "express";
import {
  create,
  deleteOne,
  downloadOne,
  getMany,
  getOne,
  updateOne,
} from "./file.handlers";
import uploadFile from "../../apps/multer";

const app = Router();

app.post("/", uploadFile.single("file"), create);
app.get("/", getMany);
app.get("/:id", downloadOne);
app.get("/:id", getOne);
app.put("/:id", updateOne);
app.delete("/:id", deleteOne);

export default app;
