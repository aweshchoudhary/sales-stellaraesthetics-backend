import { NextFunction, Request, Response } from "express";
import admin from "./firebase";
import { PrismaClient } from "@prisma/client";
import { getUserByApiKey } from "./auth.controllers";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import axios from "axios";

const prisma = new PrismaClient();

async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const idToken: string = req.headers.authorization?.split(" ")[1] || "";
    const apiKey: string = req.headers["api-key"]?.toString() || "";

    if (idToken && apiKey) {
      res.status(400).json({
        message: "Both Firebase token and API key present. Choose one.",
      });
      return;
    }

    if (idToken) {
      const decodedToken: DecodedIdToken = await admin
        .auth()
        .verifyIdToken(idToken);
      const user = await prisma.user.findFirst({
        where: {
          userId: decodedToken.uid,
        },
        include: {
          created: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      req.user = user;
      next();
    } else if (apiKey) {
      const foundKey = await prisma.apiKey.findFirst({
        where: {
          key: apiKey,
        },
      });

      if (foundKey) {
        const user = await getUserByApiKey(apiKey, next);

        if (user) {
          req.user = user;
          req.body = { ...req.body, createdById: user.id };
        }

        next();
      } else {
        res.status(401).json({ message: "Invalid API key" });
      }
    } else {
      res.status(401).json({ message: "Authorization header missing" });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
}

export async function validateApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey: string = req.headers["api-key"]?.toString() || "";
  const foundKey = await prisma.apiKey.findFirst({
    where: {
      key: apiKey,
    },
  });

  if (foundKey) {
    const user = await getUserByApiKey(apiKey, next);

    if (user) {
      req.user = user;
      req.body = { ...req.body, createdById: user.id };
    }

    next();
  } else {
    res.status(401).json({ message: "Invalid API key" });
  }
}

async function authenticateWith(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const accessToken: string = req.headers.authorization?.split(" ")[1] || "";
    const apiKey: string = req.headers["api-key"]?.toString() || "";

    if (accessToken && apiKey) {
      res.status(400).json({
        message: "Both Firebase token and API key present. Choose one.",
      });
      return;
    }

    if (accessToken) {
      const userByAccessToken = await axios.get(
        `http://localhost:8000/api/v1/users/me` ?? "",
        {
          headers: {
            Authorization: "bearer " + accessToken,
          },
        }
      );
      const user = await prisma.user.findFirst({
        where: {
          userId: userByAccessToken.data.id,
        },
        include: {
          created: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      req.user = user;
      next();
    } else if (apiKey) {
      validateApiKey(req, res, next);
    } else {
      res.status(401).json({ message: "Authorization header missing" });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
}

export default authenticateWith;
