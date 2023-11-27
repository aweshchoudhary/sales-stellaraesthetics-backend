import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import queryStringCheck from "../../utils/querystring.checker";

const prisma = new PrismaClient();

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const note = await prisma.note.create({ data: req.body });
    await prisma.deal.updateMany({
      where: { id: { in: note.deals } },
      data: { notes: { push: note.id } },
    });
    await prisma.contact.updateMany({
      where: { id: { in: note.contacts } },
      data: { notes: { push: note.id } },
    });
    res.status(200).json({ message: "Note created successfully", data: note });
  } catch (error) {
    next(error); // Handle errors
  }
}

export async function getMany(req: Request, res: Response, next: NextFunction) {
  try {
    const config = queryStringCheck(req);

    // Your logic for retrieving many resources from the server goes here
    const notes = await prisma.note.findMany(config);
    const count = await prisma.note.count({ where: config?.where });

    res.status(200).json({
      data: notes,
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
    const note = await prisma.note.findUnique({
      where: {
        id: req.params.id,
      },
      ...config,
    });

    res.status(200).json({
      data: note,
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
        .json({ message: "You cannot change the id of this note" });
    }

    // Your logic for updating a resource on the server goes here
    const note = await prisma.note.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    res.status(200).json({
      data: note,
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
    await prisma.note.delete({ where: { id: req.params.id } });

    res.status(200).json({
      message: "Note Deleted Successfully",
    });
  } catch (error) {
    next(error); // Handle errors
  }
}
