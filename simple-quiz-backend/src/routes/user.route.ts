import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { verifyAdmin, verifyUser } from "../middlewares/authenticate";

const userRouter = Router();

userRouter.get("/", verifyUser, verifyAdmin, userController.getAllUsers);

export default userRouter;
