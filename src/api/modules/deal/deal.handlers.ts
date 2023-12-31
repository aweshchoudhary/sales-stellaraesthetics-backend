import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import queryStringCheck from "../../utils/querystring.checker";
import { deleteActivities, deleteDeals } from "../../helper/delete.helper";

const prisma = new PrismaClient();

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const stage = await prisma.stage.findUnique({
      where: { id: req.body.currentStageId },
    });

    if (!stage) {
      return res.status(404).json({ error: "Stage not found" });
    }

    // Create a new deal and connect it to the current stage and pipeline
    const deal = await prisma.deal.create({
      data: { ...req.body, pipelineId: stage.pipelineId },
    });

    // Update the current stage to connect to the newly created deal
    await prisma.stage.update({
      where: { id: req.body.currentStageId },
      data: { deals: { connect: { id: deal.id } } },
    });

    // Update the pipeline to connect to the newly created deal
    await prisma.pipeline.update({
      where: { id: stage.pipelineId },
      data: { deals: { connect: { id: deal.id } } },
    });

    res.status(200).json({ message: "Deal created successfully" });
  } catch (error) {
    next(error); // Handle errors
  }
}

export async function getMany(req: Request, res: Response, next: NextFunction) {
  try {
    const config = queryStringCheck(req);

    // Your logic for retrieving many resources from the server goes here
    const deals = await prisma.deal.findMany(config);
    const count = await prisma.deal.count({ where: config?.where });

    res.status(200).json({
      data: deals,
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
    const deal = await prisma.deal.findUnique({
      where: {
        id: req.params.id,
      },
      ...config,
    });

    res.status(200).json({
      data: deal,
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
        .json({ message: "You cannot change the id of this deal" });
    }

    // Your logic for updating a resource on the server goes here
    const deal = await prisma.deal.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    res.status(200).json({
      data: deal,
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
    await prisma.deal.delete({ where: { id: req.params.id } });
    await deleteActivities([req.params.id]);

    res.status(200).json({
      message: "Deal Deleted Successfully",
    });
  } catch (error) {
    next(error); // Handle errors
  }
}

export async function updateDealStage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { newStageId, prevStageId, dealId } = req.body;

    await prisma.stage.update({
      where: {
        id: prevStageId,
      },
      data: {
        deals: {
          disconnect: {
            id: dealId,
          },
        },
      },
    });

    await prisma.stage.update({
      where: {
        id: newStageId,
      },
      data: {
        deals: {
          connect: {
            id: dealId,
          },
        },
      },
    });

    // Your logic for updating a resource on the server goes here
    const deal = await prisma.deal.update({
      where: {
        id: req.params.id,
      },
      data: {
        currentStageId: newStageId,
      },
    });

    res.status(200).json({
      data: deal,
    });
  } catch (error) {
    next(error); // Handle errors
  }
}
