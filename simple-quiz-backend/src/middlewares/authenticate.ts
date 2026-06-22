import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { Question } from "../models/question.model";

export interface AuthRequest extends Request {
  user?: any;
}

export const verifyUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({
        message: "Unauthorized !",
      });
      return;
    }
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error: any) {
    res.status(401).json({
      message: error.message,
    });
  }
};

export const verifyAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "User not authenticated !",
      });
      return;
    }

    if (req.user.admin) {
      next();
      return;
    }

    res.status(403).json({
      message: "Dont have permission to access this resource !",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error !",
    });
  }
};

export const verifyAuthor = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { questionId } = req.params;
    const question = await Question.findById(questionId);
    if (!question) {
      res.status(404).json({
        message: "Question not found !",
      });
      return;
    }
    if (question.author.toString() === req.user._id.toString()) {
      next();
      return;
    }
    res.status(403).json({
      message: "You are not the author of this question !",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};
