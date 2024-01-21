import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import queryStringCheck from "../../utils/querystring.checker";
import { deleteActivities, deleteDeals } from "../../helper/delete.helper";
import { dealCreateSchema, dealUpdateSchema } from "./deal.util";

const prisma = new PrismaClient();

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const validRequest = dealCreateSchema.parse(req);
    const loggedUser: any = req.user;

    const stage = await prisma.stage.findUnique({
      where: { id: validRequest.body.currentStageId },
    });

    if (!stage) {
      return res.status(404).json({ error: "Stage not found" });
    }

    // Create a new deal and connect it to the current stage and pipeline
    const deal = await prisma.deal.create({
      data: {
        ...validRequest.body,
        currentStageId: stage.id,
        pipelineId: stage.pipelineId,
        createdById: loggedUser.created.id,
      },
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
    const deals = await prisma.deal.findMany({ where: {}, ...config });
    const count = await prisma.deal.count({ where: {} });

    res.status(200).json({
      data: deals,
      count,
    });
  } catch (error) {
    next(error); // Handle errors
  }
}

export async function getManyByStageId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const stageId = req.params.stageId;
    const config = queryStringCheck(req);

    // Your logic for retrieving many resources from the server goes here
    const deals = await prisma.deal.findMany({
      where: {
        currentStageId: stageId,
      },
      include: {
        label: true,
      },
      ...config,
    });
    const count = await prisma.deal.count({
      where: {
        currentStageId: stageId,
      },
    });

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
    const validRequest = dealUpdateSchema.parse(req);
    const { notes, files, ...validFields } = validRequest.body;

    if (files?.length) {
      await prisma.deal.update({
        where: {
          id: req.params.id,
        },
        data: {
          files: {
            connect: files?.map((fileId: string) => ({ id: fileId })),
          },
        },
      });
    }

    if (notes?.length) {
      await prisma.deal.update({
        where: {
          id: req.params.id,
        },
        data: {
          files: {
            connect: files?.map((fileId: string) => ({ id: fileId })),
          },
        },
      });
    }
    // Your logic for updating a resource on the server goes here
    const deal = await prisma.deal.update({
      where: {
        id: req.params.id,
      },
      data: validFields,
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
