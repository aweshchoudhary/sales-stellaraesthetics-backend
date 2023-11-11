import { NextFunction, Request, Response } from "express";

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.oidc.isAuthenticated()) next();
  else res.status(401).json({ message: "You are not authenticated!" });
}

export default isAuthenticated;
