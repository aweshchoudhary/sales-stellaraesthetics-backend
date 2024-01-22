import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import queryStringCheck from "../../utils/querystring.checker";
import { labelCreateSchema } from "./label.util";

const prisma = new PrismaClient();

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const validRequest = labelCreateSchema.parse(req);
    const loggedUser: any = req.user;
    const newLabel = await prisma.label.create({
      data: { ...validRequest.body, createdById: loggedUser.created.id },
    });
    res
      .status(200)
      .json({ message: "Label created successfully", data: newLabel });
  } catch (error) {
    next(error); // Handle errors
  }
}

export async function getMany(req: Request, res: Response, next: NextFunction) {
  try {
    const config = queryStringCheck(req);

    // Your logic for retrieving many resources from the server goes here
    const label = await prisma.label.findMany({ where: {}, ...config });
    const count = await prisma.label.count({ where: {} });

    res.status(200).json({
      data: label,
      count,
    });
  } catch (error) {
    next(error); // Handle errors
  }
}

export async function getManyPipelineId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const config = queryStringCheck(req);

    // Your logic for retrieving many resources from the server goes here
    const labels = await prisma.label.findMany({
      where: {
        pipelineId: req.params.pipelineId,
      },
      ...config,
    });
    const count = await prisma.label.count({
      where: {
        pipelineId: req.params.pipelineId,
      },
    });

    res.status(200).json({
      data: labels,
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
    const label = await prisma.label.findUnique({
      where: {
        id: req.params.id,
      },
      ...config,
    });

    res.status(200).json({
      data: label,
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
        .json({ message: "You cannot change the id of this label" });
    }

    // Your logic for updating a resource on the server goes here
    const label = await prisma.label.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    res.status(200).json({
      data: label,
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
    await prisma.label.delete({ where: { id: req.params.id } });

    res.status(200).json({
      message: "Label Deleted Successfully",
    });
  } catch (error) {
    next(error); // Handle errors
  }
}
