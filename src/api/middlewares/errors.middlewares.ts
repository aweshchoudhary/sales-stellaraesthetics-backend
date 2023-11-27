import { NextFunction, Request, Response } from "express";

// Middleware to simulate an error
export const errorGeneratorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error: any = new Error("This is a simulated error");
  error.status = 500;
  next(error);
};

// Error handling middleware
export const errorResponseMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set the status code of the response
  res.status(err.status || 500);

  console.log(err);

  // Send the error message in the response
  res.json({
    error: {
      message: err.message,
    },
  });
};
