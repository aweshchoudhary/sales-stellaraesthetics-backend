import { Router } from "express";
import pipeline from "./modules/pipeline/pipeline.routes";
import stage from "./modules/stage/stage.routes";
import contact from "./modules/contact/contact.routes";
import note from "./modules/note/note.routes";
import deal from "./modules/deal/deal.routes";
import label from "./modules/label/label.routes";
import file from "./modules/file/file.routes";
import activity from "./modules/activity/activity.routes";
import user from "./modules/user/user.routes";
import auth from "./modules/auth/auth.routes";

const app = Router();

app.use("/auth", auth);
app.use("/pipelines", pipeline);
app.use("/stages", stage);
app.use("/contacts", contact);
app.use("/notes", note);
app.use("/deals", deal);
app.use("/labels", label);
app.use("/files", file);
app.use("/activities", activity);
app.use("/users", user);

export default app;
