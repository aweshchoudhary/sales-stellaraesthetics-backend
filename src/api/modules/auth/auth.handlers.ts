import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "./fireabase.config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
} from "firebase/auth";

const prisma = new PrismaClient();

export async function registerUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const newUserData: any = req.body;
    const response = await createUserWithEmailAndPassword(
      auth,
      newUserData.email,
      newUserData.password
    );

    // Your logic for creating a resource on the server goes here
    await prisma.user.create({
      data: {
        name: req.body.name,
        firebaseUID: response.user.uid,
      },
    });

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    next(error); // Handle errors
  }
}
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (email && password) {
      await signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user1 = userCredential.user;
          const token = await userCredential.user.getIdToken();
          res.cookie("accessToken", token);
          res.json({ data: user1, token });
        })
        .catch((error) => {
          const errorMessage = error.message;
          res.status(400).json({ error: errorMessage });
        });
    }
  } catch (error) {
    next(error); // Handle errors
  }
}

export async function passswordChange(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { newPassword } = req.body;
    const user: any = req.user;
    if (newPassword) {
      await updatePassword(user, newPassword);
    }
    res.status(200).json({ message: "Password Updated" });
  } catch (error) {
    next(error); // Handle errors
  }
}
