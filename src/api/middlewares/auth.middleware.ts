import { NextFunction, Request, Response } from "express";
import admin from "../auth/firebase";

async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const idToken: string = req.headers.authorization ?? "";
    const decodedToken = await admin
      .auth()
      .verifyIdToken(idToken.split(" ")[1]);
    req.user = decodedToken;
    next();
  } catch (error) {
    // console.error("Authentication error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
}

const addRole = async (uid: string, role: string) => {
  await admin.auth().setCustomUserClaims(uid, { role: role });
};

const getUserRoles = async (uid: string) => {
  const user = await admin.auth().getUser(uid);
  return user.customClaims ? user.customClaims.role : null;
};

export default authenticate;
