import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import queryStringCheck from "../../utils/querystring.checker";

const prisma = new PrismaClient();

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const activity = await prisma.activity.create({ data: req.body });
    const updateActivitys = req.body.deals.map(async (e: string) => {
      await prisma.deal.update({
        where: {
          id: e,
        },
        data: {
          activities: {
            connect: {
              id: activity.id,
            },
          },
        },
      });
    });

    await Promise.all(updateActivitys);

    res.status(200).json({ message: "Activity created successfully" });
  } catch (error) {
    next(error); // Handle errors
  }
}

export async function getMany(req: Request, res: Response, next: NextFunction) {
  try {
    const config = queryStringCheck(req);

    // Your logic for retrieving many resources from the server goes here
    const activities = await prisma.activity.findMany(config);
    const count = await prisma.activity.count(config);

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
