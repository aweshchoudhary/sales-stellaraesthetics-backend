import { NextFunction, Request, Response } from "express";
import admin from "./firebase";
import { PrismaClient } from "@prisma/client";
import { getUserByApiKey } from "./auth.controllers";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
// import  {RoleInterface, getPermissionsByRoleName, getRoleByName, getRoles} from "./roles.model";

const prisma = new PrismaClient();

// exports.checkUserPermission = async (userId:string, permission: string) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     const user = await prisma.user.findFirst({
//       where: {
//         id: userId,
//       },
//     })
//     const userRole = user ? user.role : "anonymous";
//     const userPermissions = new getPermissionsByRoleName(
//       userRole
//     );

//     if (userPermissions.includes(permission)) {
//       return next();
//     } else {
//       return res.status(403).json({ error: "Access denied" });
//     }
//   };
// };

async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const idToken: string = req.headers.authorization ?? "";
    if (idToken) {
      const decodedToken: DecodedIdToken = await admin
        .auth()
        .verifyIdToken(idToken.split(" ")[1]);
      const user = await prisma.user.findFirst({
        where: {
          userId: decodedToken.uid,
        },
      });
      if (!user) {
        res.status(401).json({ message: "Unauthorized" });
      } else {
        req.user = user;
      }
      next();
    }

    const apiKey: string = req.headers["api-key"]?.toString() ?? "";
    if (apiKey) {
      const foundKey = await prisma.apiKey.findFirst({
        where: {
          key: apiKey,
        },
      });
      if (!foundKey) res.status(401).json({ message: "Unauthorized" });

      const user = await getUserByApiKey(apiKey, next);
      if (!user) {
        res.status(401).json({ message: "Unauthorized" });
      }
      req.body = { ...req.body, userId: user?.id };
      next();
    }
  } catch (error) {
    // console.error("Authentication error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
}

// const checkUserRoleAccess =

const getUserRoles = async (uid: string) => {
  const user = await admin.auth().getUser(uid);
  return user.customClaims ? user.customClaims.role : null;
};

export default authenticate;
