import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import queryStringCheck from "../../utils/querystring.checker";
import { deletePipeline } from "../../helper/delete.helper";
import {
  pipelineAssignUserSchema,
  pipelineChangeOwnershipSchema,
  pipelineGetByUserIdSchema,
} from "./pipeline.util";
import { isUserExistWithId } from "../user/user.controllers";
import { isPipelineExistWithId } from "./pipeline.controllers";

const prisma = new PrismaClient();

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const loggedUser: any = req.user;
    // Your logic for creating a resource on the server goes here
    if (loggedUser) {
      await prisma.pipeline.create({
        data: {
          ...req.body,
          createdBy: { connect: { id: loggedUser?.id } },
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
    const pipelines = await prisma.pipeline.findMany(config);
    const count = await prisma.pipeline.count({ where: config?.where });

    res.status(200).json({
      data: pipelines,
      count,
    });
  } catch (error) {
    next(error); // Handle errors
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

    // Your logic for retrieving a single resource from the server goes here
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
    if (req.body.id) {
      return res
        .status(400)
        .json({ message: "You cannot change the id of this pipeline" });
    }

    // Your logic for updating a resource on the server goes here
    const pipeline = await prisma.pipeline.update({
      where: {
        id: req.params.pipelineId,
      },
      data: req.body,
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
    const validRequest = pipelineAssignUserSchema.parse(req);

    const isPipelineExist = await isPipelineExistWithId(req.params.id);
    const isUserExist = await isUserExistWithId(
      validRequest.body.newAssigneeId
    );

    if (!isPipelineExist) {
      return res.status(400).json({ message: "Pipeline does not exist" });
    }
    if (!isUserExist) {
      return res.status(400).json({ message: "User does not exist" });
    }

    await prisma.assigneesOnPipelines.delete({
      where: {
        pipelineId_assigneeId: {
          pipelineId: req.params.pipelineId,
          assigneeId: validRequest.body.newAssigneeId,
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

    const isPipelineExist = await isPipelineExistWithId(req.params.id);
    const isUserExist = await isUserExistWithId(validRequest.body.newOwnerId);

    if (!isUserExist) {
      return res.status(400).json({ message: "User does not exist" });
    }

    if (!isPipelineExist) {
      return res.status(400).json({ message: "Pipeline does not exist" });
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
