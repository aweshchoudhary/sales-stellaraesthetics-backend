import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import queryStringCheck from "../../utils/querystring.checker";
import validate from "../../common/validate.schema";
import {
  NotificationBaseInterface,
  notificationCreateSchema,
  notificationReadSchema,
} from "./notifcation.util";
import { z } from "zod";
import {
  createNotification,
  sendNotificationToUsers,
} from "./notification.controllers";

const prisma = new PrismaClient();

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const request = notificationCreateSchema.parse(req.body);
    const notification = await createNotification(request);

    await sendNotificationToUsers(notification.id, request.body.sentTo);

    res.status(200).json({
      message: "Notification created successfully",
    });
  } catch (error) {
    next(error); // Handle errors
  }
}

export async function getMany(req: Request, res: Response, next: NextFunction) {
  try {
    const config = queryStringCheck(req);

    // Your logic for retrieving many resources from the server goes here
    const notifications = await prisma.notification.findMany(config);
    const count = await prisma.notification.count(config);

    res.status(200).json({
      data: notifications,
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
    const notification = await prisma.notification.findUnique({
      where: {
        id: req.params.id,
      },
      ...config,
    });

    res.status(200).json({
      data: notification,
    });
  } catch (error) {
    next(error); // Handle errors
  }
}

type NotificationReadSchema = z.infer<typeof notificationReadSchema>;

export async function readOne(req: Request, res: Response, next: NextFunction) {
  try {
    const { body }: NotificationReadSchema = req;
    // Your logic for updating a resource on the server goes here
    const notification = await prisma.notification.update({
      where: {
        id: req.params.id,
      },
      data: {
        openBy: {},
      },
    });

    res.status(200).json({
      data: notification,
    });
  } catch (error) {
    next(error); // Handle errors
  }
}

export async function readMany(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.body.id) {
      return res
        .status(400)
        .json({ message: "You cannot change the id of this notification" });
    }

    // Your logic for updating a resource on the server goes here
    const notification = await prisma.notification.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    res.status(200).json({
      data: notification,
    });
  } catch (error) {
    next(error); // Handle errors
  }
}

// export async function deleteOne(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     await prisma.label.delete({ where: { id: req.params.id } });

//     res.status(200).json({
//       message: "Notification Deleted Successfully",
//     });
//   } catch (error) {
//     next(error); // Handle errors
//   }
// }
