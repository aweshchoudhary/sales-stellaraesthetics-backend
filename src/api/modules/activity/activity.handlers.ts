import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import queryStringCheck from "../../utils/querystring.checker";
import { activityCreateSchema } from "./activity.util";

const prisma = new PrismaClient();

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    let { start, end } = req.body;
    if (start && end) {
      start = new Date(start);
      end = new Date(end);
    }
    const validRequest = activityCreateSchema.parse({
      body: {
        ...req.body,
        start,
        end,
      },
    });
    const { files, ...validFields } = validRequest.body;
    const loggedUser: any = req.user;
    await prisma.activity.create({
      data: { ...validFields, createdById: loggedUser.created.id },
    });
    res.status(200).json({ message: "Activity created successfully" });
  } catch (error) {
    next(error);
  }
}

export async function getMany(req: Request, res: Response, next: NextFunction) {
  try {
    const config = queryStringCheck(req);

    // Your logic for retrieving many resources from the server goes here
    const activities = await prisma.activity.findMany({ where: {}, ...config });
    const count = await prisma.activity.count({ where: {} });

    res.status(200).json({
      data: activities,
      count,
    });
  } catch (error) {
    next(error); // Handle errors
  }
}

export async function getManyDealId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const status = req.query.status;
    const config = queryStringCheck(req);

    // Your logic for retrieving many resources from the server goes here
    const activities = await prisma.activity.findMany({
      where: {
        dealId: req.params.dealId,
      },
      ...config,
    });

    const count = await prisma.activity.count({
      where: {
        dealId: req.params.dealId,
      },
    });

    res.status(200).json({
      data: activities,
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
    const activity = await prisma.activity.findUnique({
      where: {
        id: req.params.id,
      },
      ...config,
    });

    res.status(200).json({
      data: activity,
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
        .json({ message: "You cannot change the id of this activity" });
    }

    // Your logic for updating a resource on the server goes here
    const activity = await prisma.activity.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    res.status(200).json({
      data: activity,
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
    await prisma.activity.delete({ where: { id: req.params.id } });

    res.status(200).json({
      message: "Activity Deleted Successfully",
    });
  } catch (error) {
    next(error); // Handle errors
  }
}
