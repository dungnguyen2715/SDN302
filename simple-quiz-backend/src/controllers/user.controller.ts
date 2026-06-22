import { Request, Response } from "express";
import { User } from "../models/user.model";

export const userController = {
  getAllUsers: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const users = await User.find().select("-password");

      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
};