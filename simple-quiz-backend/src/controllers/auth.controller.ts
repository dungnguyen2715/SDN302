import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const authController = {
  signup: async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password, admin } = req.body;
      if (!username || !password) {
        res.status(400).json({
          message: "Username and password are required !",
        });
        return;
      }
      const findUser = await User.findOne({ username });
      if (findUser) {
        res.status(400).json({
          message: "User already exists !",
        });
        return;
      }
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        password: hashPassword,
        admin: admin || false,
      });
      const savedUser = await newUser.save();
      res.status(201).json({
        message: "Signup successful",
        user: {
          id: savedUser._id,
          username: savedUser.username,
          admin: savedUser.admin,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        res.status(400).json({
          message: "Username or password is required !",
        });
        return;
      }
      const findUser = await User.findOne({ username });
      if (!findUser) {
        res.status(400).json({
          message: "User not found !",
        });
        return;
      }

      const isMatchPassword = await bcrypt.compare(password, findUser.password);
      if (!isMatchPassword) {
        res.status(400).json({
          message: "Password is not correct !",
        });
        return;
      }
      const token = jwt.sign(
        {
          _id: findUser.id,
          username: findUser.username,
          admin: findUser.admin,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1d",
        },
      );
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          _id: findUser._id,
          username: findUser.username,
          admin: findUser.admin,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
};
