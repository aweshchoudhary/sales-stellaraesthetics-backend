import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import queryStringCheck from "../../utils/querystring.checker";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { filename, mimetype, path, size }: any = req.file;
    const file = await prisma.file.create({
      data: {
        name: filename,
        type: mimetype,
        url: path,
        size,
        ...req.body,
      },
    });

    res.status(200).json({ message: "File created successfully", data: file });
  } catch (error) {
    fs.unlink(req.file?.path ?? "", () => console.log("file removed"));
    next(error); // Handle errors
  }
}

export async function getMany(req: Request, res: Response, next: NextFunction) {
  try {
    const config = queryStringCheck(req);
    // Your logic for retrieving many resources from the server goes here
    const files = await prisma.file.findMany(config);
    const count = await prisma.file.count(config);

    res.status(200).json({
      data: files,
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
    const file = await prisma.file.findUnique({
      where: {
        id: req.params.id,
      },
      ...config,
    });

    res.status(200).json({
      data: file,
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
        .json({ message: "You cannot change the id of this file" });
    }

    // Your logic for updating a resource on the server goes here
    const file = await prisma.file.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    res.status(200).json({
      data: file,
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
    const file = await prisma.file.findUnique({
      where: { id: req.params.id },
      select: { id: true, url: true },
    });

    file &&
      fs.unlink(file.url ?? "", async () => {
        await prisma.file.delete({ where: { id: file?.id } });
      });

    res.status(200).json({
      message: "File Deleted Successfully",
    });
  } catch (error) {
    next(error); // Handle errors
  }
}

export async function downloadOne(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "../public/uploads/", filename);
    res.status(200).sendFile(filePath);
  } catch (error) {
    next(error); // Handle errors
  }
}
