import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import queryStringCheck from "../../utils/querystring.checker";
import { contactCreateSchema } from "./contact.util";

const prisma = new PrismaClient();

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const validRequest = contactCreateSchema.parse(req);
    const loggedUser: any = req.user;
    const contact = await prisma.contact.create({
      data: { ...validRequest.body, createdById: loggedUser.created.id },
    });
    res
      .status(200)
      .json({ message: "Contact created successfully", data: contact });
  } catch (error) {
    console.log(error);
    next(error); // Handle errors
  }
}

export async function getMany(req: Request, res: Response, next: NextFunction) {
  try {
    const config = queryStringCheck(req);

    // Your logic for retrieving many resources from the server goes here
    const contacts = await prisma.contact.findMany({ where: {}, ...config });
    const count = await prisma.contact.count({ where: {} });

    res.status(200).json({
      data: contacts,
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
    const contact = await prisma.contact.findUnique({
      where: {
        id: req.params.id,
      },
      ...config,
    });

    res.status(200).json({
      data: contact,
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
        .json({ message: "You cannot change the id of this contact" });
    }

    // Your logic for updating a resource on the server goes here
    const contact = await prisma.contact.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    res.status(200).json({
      data: contact,
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
    await prisma.contact.delete({ where: { id: req.params.id } });

    res.status(200).json({
      message: "Contact Deleted Successfully",
    });
  } catch (error) {
    next(error); // Handle errors
  }
}
