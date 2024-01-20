import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import queryStringCheck from "../../utils/querystring.checker";
import { deletePipeline } from "../../helper/delete.helper";
import {
  pipelineAssignUserSchema,
  pipelineChangeOwnershipSchema,
  pipelineCreateSchema,
  pipelineGetByUserIdSchema,
  pipelineRemoveUserSchema,
  pipelineUpdateSchema,
} from "./pipeline.util";
import { isUserExistWithId } from "../user/user.controllers";
import { isPipelineExistWithId } from "./pipeline.controllers";

const prisma = new PrismaClient();

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const validRequest = pipelineCreateSchema.parse(req);
    const { stages, deals, assignees, ...validFields } = validRequest.body;
    const loggedUser: any = req.user;
    // Your logic for creating a resource on the server goes here
    if (loggedUser) {
      await prisma.pipeline.create({
        data: {
          ...validFields,
          createdById: loggedUser.created.id,
        },
      });
    }

    res.status(200).json({ message: "Pipeline created successfully" });
  } catch (error) {
    next(error); // Handle errors
  }
}

export async function getMany(req: Request, res: Response, next: NextFunction) {
  try {
    const config = queryStringCheck(req);

    // Your logic for retrieving many resources from the server goes here
    const pipelines = await prisma.pipeline.findMany({ where: {}, ...config });
    const count = await prisma.pipeline.count({ where: {} });

    res.status(200).json({
      data: pipelines,
      count,
    });
  } catch (error) {
    next(error); // Handle errors
  }
}

export async function getPipelineTableDataByOwnerId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let filteredPipelines: any = [];
    let limit = parseInt(`${req.query?.limit}` ?? "10");
    let skip = parseInt(`${req.query?.skip}` ?? "0");

    const loggedUser: any = req.user;

    const pipelinesByOwnerId = await prisma.pipeline.findMany({
      where: {
        createdById: loggedUser.created.id,
      },
      include: {
        deals: true,
      },
      take: limit,
      skip,
    });

    pipelinesByOwnerId.map((pipeline) => {
      const { createdById, deals, ...publicFields } = pipeline;
      let openDealsCount = 0;
      let wonDealsCount = 0;
      let lostDealsCount = 0;
      let totalDealsCount = pipeline.deals.length ?? 0;

      pipeline.deals.map((deal) => {
        if (deal.status === "open") {
          openDealsCount += 1;
        }
        if (deal.status === "won") {
          wonDealsCount += 1;
        }
        if (deal.status === "lost") {
          lostDealsCount += 1;
        }
      });

      filteredPipelines.push({
        ...publicFields,
        openDealsCount,
        wonDealsCount,
        lostDealsCount,
        totalDealsCount,
      });
    });

    res
      .status(200)
      .json({ data: filteredPipelines, count: filteredPipelines?.length ?? 0 });
  } catch (error) {
    next(error);
  }
}

export async function getManyByUserId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const validateRequest = pipelineGetByUserIdSchema.parse(req);
    // const config = queryStringCheck(req);
    const filters = {
      createdById: validateRequest.body.createdById,
    };

    const pipelines = await prisma.pipeline.findMany({ where: filters });
    const count = await prisma.pipeline.count({ where: filters });

    res.status(200).json({
      data: pipelines,
      count,
    });
  } catch (error) {
    next(error); // Handle errors
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const config = queryStringCheck(req);
    const pipeline = await prisma.pipeline.findUnique({
      where: {
        id: req.params.pipelineId,
      },
      ...config,
    });

    res.status(200).json({
      data: pipeline,
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
    const validRequest = pipelineUpdateSchema.parse(req);
    const { deals, stages, ...validFields } = validRequest.body;

    if (deals?.length) {
      await prisma.pipeline.update({
        where: {
          id: req.params.pipelineId,
        },
        data: {
          deals: {
            connect: deals.map((deal: string) => ({ id: deal })),
          },
        },
      });
    }

    if (stages?.length) {
      await prisma.pipeline.update({
        where: {
          id: req.params.pipelineId,
        },
        data: {
          stages: {
            connect: stages.map((deal: string) => ({ id: deal })),
          },
        },
      });
    }

    const pipeline = await prisma.pipeline.update({
      where: {
        id: req.params.pipelineId,
      },
      data: validFields,
    });

    res.status(200).json({
      data: pipeline,
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
    await deletePipeline(req.params.pipelineId);
    res.status(200).json({
      message: "Pipeline Deleted Successfully",
    });
  } catch (error) {
    next(error); // Handle errors
  }
}

export async function assignUserToPipeline(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const validRequest = pipelineAssignUserSchema.parse(req);

    const isAssigneeAlreadyExistOnPipeline =
      await prisma.assigneesOnPipelines.count({
        where: {
          pipelineId: req.params.pipelineId,
          assigneeId: validRequest.body.newAssigneeId,
        },
      });

    if (isAssigneeAlreadyExistOnPipeline > 0) {
      return res
        .status(400)
        .json({ message: "Assignee already assigned to this pipeline" });
    }

    await prisma.assigneesOnPipelines.create({
      data: {
        pipelineId: req.params.pipelineId,
        assigneeId: validRequest.body.newAssigneeId,
      },
    });

    res.status(200).json({
      message: "User assigned to this pipeline",
    });
  } catch (error) {
    next(error); // Handle errors
  }
}

export async function removeUserFromPipeline(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const validRequest = pipelineRemoveUserSchema.parse(req);

    const isPipelineExist = await isPipelineExistWithId(req.params.id);
    const isUserExist = await prisma.user.count({
      where: {
        created: {
          id: validRequest.body.assigneeId,
        },
      },
    });

    if (!isPipelineExist) {
      return res.status(400).json({ message: "Pipeline does not exist" });
    }
    if (isUserExist < 1) {
      return res.status(400).json({ message: "User does not exist" });
    }

    await prisma.assigneesOnPipelines.delete({
      where: {
        pipelineId_assigneeId: {
          pipelineId: req.params.pipelineId,
          assigneeId: validRequest.body.assigneeId,
        },
      },
    });

    res.status(200).json({
      message: "User removed from this pipeline",
    });
  } catch (error) {
    next(error);
  }
}

export async function changeOwnershipOfPipeline(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const validRequest = pipelineChangeOwnershipSchema.parse(req);
    const isPipelineExist = await isPipelineExistWithId(req.params.pipelineId);
    const isUserExist = await prisma.user.count({
      where: {
        created: {
          id: validRequest.body.newOwnerId,
        },
      },
    });

    if (!isPipelineExist) {
      return res.status(400).json({ message: "Pipeline does not exist" });
    }
    if (isUserExist < 1) {
      return res.status(400).json({ message: "User does not exist" });
    }

    await prisma.pipeline.update({
      where: {
        id: req.params.pipelineId,
      },
      data: {
        createdBy: {
          connect: {
            id: validRequest.body.newOwnerId,
          },
        },
      },
    });

    res.status(200).json({
      message: "Onwership has been changed!",
    });
  } catch (error) {
    next(error); // Handle errors
  }
}
