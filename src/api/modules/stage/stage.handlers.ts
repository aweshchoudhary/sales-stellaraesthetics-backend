import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import queryStringCheck from "../../utils/querystring.checker";
import { deleteDeals } from "../../helper/delete.helper";
import { stageCreateSchema, stageUpdateSchema } from "./stage.util";

const prisma = new PrismaClient();

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const validRequest = stageCreateSchema.parse(req);
    const { position, pipelineId } = validRequest.body;

    const loggedUser: any = req.user;

    const stages = await prisma.stage.findMany({
      where: {
        pipelineId,
      },
    });

    if (position && position > 0) {
      stages.forEach(async (item) => {
        if (item.position >= position) {
          await prisma.stage.update({
            where: {
              id: item.id,
            },
            data: {
              position: item.position + 1,
            },
          });
        }
      });
    }

    const { deals, ...validFields } = validRequest.body;
    // Your logic for creating a resource on the server goes here
    await prisma.stage.create({
      data: { ...validFields, createdById: loggedUser.created.id },
    });

    res.status(200).json({ message: "Stage created successfully" });
  } catch (error) {
    next(error); // Handle errors
  }
}

export async function getMany(req: Request, res: Response, next: NextFunction) {
  try {
    const config = queryStringCheck(req);

    // Your logic for retrieving many resources from the server goes here
    const stages = await prisma.stage.findMany(config);
    const count = await prisma.stage.count({ where: config?.where });

    res.status(200).json({
      data: stages,
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
    const stage = await prisma.stage.findUnique({
      where: {
        id: req.params.id,
      },
      ...config,
    });

    res.status(200).json({
      data: stage,
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
    const validRequest = stageUpdateSchema.parse(req);
    const { deals, ...updateData } = validRequest.body;

    if (deals?.length) {
      deals.map(async (dealId) => {
        await prisma.stage.update({
          where: {
            id: req.params.id,
          },
          data: {
            deals: {
              connect: {
                id: dealId,
              },
            },
          },
        });
      });
    }

    const stage = await prisma.stage.update({
      where: {
        id: req.params.id,
      },
      data: updateData,
    });

    res.status(200).json({
      data: stage,
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
    const stage = await prisma.stage.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!stage) {
      res.status(400).json({
        message: "Stage not found",
      });
    }

    const stagesToUpdate = await prisma.stage.findMany({
      where: {
        pipelineId: stage?.pipelineId,
        position: { gt: stage?.position },
      },
    });

    stagesToUpdate.forEach(async (stage) => {
      await prisma.stage.update({
        where: {
          id: stage.id,
        },
        data: {
          position: stage.position + 1,
        },
      });
    });

    await deleteDeals(req.params.id);

    await prisma.stage.delete({
      where: {
        id: req.params.id,
        position: stage?.position,
      },
    });

    res.status(200).json({
      message: "Stage Deleted Successfully",
    });
  } catch (error) {
    next(error); // Handle errors
  }
}

export async function reorderStages(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { newPosition, stageId }: any = req.body;

    const stagesToUpdate = await prisma.stage.findMany({
      where: {
        pipelineId: req.params.pipelineId,
      },
    });

    // Find the element to update
    const elementIndex = stagesToUpdate.findIndex(
      (item) => item.id === stageId
    );
    const element = stagesToUpdate[elementIndex];

    // Determine the direction of the move
    const moveDirection = newPosition > element.position ? 1 : -1;

    // Update the position of all elements between the old and new positions
    for (let i = element.position; i !== newPosition; i += moveDirection) {
      const targetIndex = stagesToUpdate.findIndex(
        (item) => item.position === i + moveDirection
      );
      await prisma.stage.update({
        where: { id: stagesToUpdate[targetIndex].id },
        data: { position: i },
      });
    }

    await prisma.stage.update({
      where: { id: element.id },
      data: { position: newPosition },
    });

    res.status(200).json({
      message: "Stage position has been changed",
    });
  } catch (error) {
    next(error); // Handle errors
  }
}
