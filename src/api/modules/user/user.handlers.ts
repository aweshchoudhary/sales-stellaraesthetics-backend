import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import queryStringCheck from "../../utils/querystring.checker";
import { userCreateSchema, userPublicUpdateSchema } from "./user.util";
import { isUserExistWithId } from "./user.controllers";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const validRequest = userCreateSchema.parse(req);
    const { created, ...validFields } = validRequest.body;
    const loggedUser: any = req.user;
    const user = await prisma.user.create({
      data: {
        ...validFields,
        roles: "user",
        createdById: loggedUser.id,
      },
    });
    res.status(200).json({ message: "user created successfully", data: user });
  } catch (error) {
    next(error); // Handle errors
  }
}

export async function getMany(req: Request, res: Response, next: NextFunction) {
  try {
    const config = queryStringCheck(req);

    // Your logic for retrieving many resources from the server goes here
    const users = await prisma.user.findMany(config);
    const count = await prisma.user.count({ where: config?.where });

    res.status(200).json({
      data: users,
      count,
    });
  } catch (error) {
    next(error); // Handle errors
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const config = queryStringCheck(req);

    // Your logic for retrieving a single resource from the server goes here
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
      ...config,
    });

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error); // Handle errors
  }
}

export async function updatePublicInfoOne(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const validRequest = userPublicUpdateSchema.parse(req);

    const user = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: validRequest.body,
    });

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error); // Handle errors
  }
}
export async function updateOne(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.body.id) {
      return res
        .status(400)
        .json({ message: "You cannot change the id of this user" });
    }

    // Your logic for updating a resource on the server goes here
    const user = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error); // Handle errors
  }
}

export async function deleteOne(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });

    res.status(200).json({
      message: "user Deleted Successfully",
    });
  } catch (error) {
    next(error); // Handle errors
  }
}

export async function generateAPIKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const isUserExist = await isUserExistWithId(req.params.userId);
    if (!isUserExist) res.status(404).json({ message: "User not found" });

    const loggedUser: any = req.user;

    if (loggedUser?.id !== req.params.userId)
      res
        .status(400)
        .json({ message: "You cannot generate api key for others" });

    const saltRounds = 10;
    const token = randomUUID();
    const hashedToken = await bcrypt.hash(token, saltRounds);

    const apiKeyData = await prisma.apiKey.create({
      data: {
        key: hashedToken,
        userId: req.params.userId,
      },
    });
    await prisma.user.update({
      where: {
        id: req.params.userId,
      },
      data: {
        apiKey: {
          connect: {
            id: apiKeyData.id,
          },
        },
      },
    });
    return res.status(200).json({ apiKey: hashedToken });
  } catch (error) {
    next && next(error);
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}
export async function deleteAPIKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const isUserExist = await isUserExistWithId(req.params.userId);
    if (!isUserExist) res.status(404).json({ message: "User not found" });

    const loggedUser: any = req.user;

    if (loggedUser?.id === req.params.userId) {
      await prisma.apiKey.delete({
        where: {
          userId: req.params.userId,
        },
      });
      return res.status(200).json({ message: "Api key deleted successfully" });
    }
  } catch (error) {
    next && next(error);
  } finally {
    await prisma.$disconnect();
  }
}
