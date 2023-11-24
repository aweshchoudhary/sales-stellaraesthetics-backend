import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import queryStringCheck from "../../utils/querystring.checker";
import { deletePipeline } from "../../helper/delete.helper";

const prisma = new PrismaClient();

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const loggedUser: any = req.user;
    // Your logic for creating a resource on the server goes here
    await prisma.pipeline.create({
      data: {
        ...req.body,
        owner: loggedUser.uid,
      },
    });

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
    const count = await prisma.pipeline.count(config);

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
        id: req.params.id,
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
        id: req.params.id,
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
    await deletePipeline(req.params.id);
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
    const newAssigneeId: string = req.body?.newAssigneeId;

    // Your logic for deleting a resource from the server goes here
    const isAssigneeExist = await prisma.pipeline.count({
      where: {
        assignees: {
          has: newAssigneeId,
        },
      },
    });

    if (isAssigneeExist === 1) {
      return res
        .status(400)
        .json({ message: "Assignee already assigned to this pipeline" });
    }

    await prisma.pipeline.update({
      where: {
        id: req.params.id,
      },
      data: {
        assignees: {
          push: newAssigneeId,
        },
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
    const assigneeId: string = req.body?.assigneeId;

    const pipeline = await prisma.pipeline.findUnique({
      where: {
        id: req.params.id,
      },
    });
    // Your logic for deleting a resource from the server goes here
    const filteredAssignees = pipeline?.assignees.filter(
      (e) => e !== assigneeId
    );

    console.log(filteredAssignees);

    await prisma.pipeline.update({
      where: {
        id: req.params.id,
      },
      data: {
        assignees: {
          set: filteredAssignees,
        },
      },
    });

    res.status(200).json({
      message: "User removed from this pipeline",
    });
  } catch (error) {
    next(error); // Handle errors
  }
}

export async function changeOwnershipOfPipeline(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const newOwnerId: string = req.body?.newOwnerId;

    await prisma.pipeline.update({
      where: {
        id: req.params.id,
      },
      data: {
        owner: newOwnerId,
      },
    });

    res.status(200).json({
      message: "Onwership has been changed!",
    });
  } catch (error) {
    next(error); // Handle errors
  }
}
