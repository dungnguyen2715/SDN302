import { Router } from "express";
import { questionController } from "../controllers/question.controller";
import { verifyAuthor, verifyUser } from "../middlewares/authenticate";

const questionRouter = Router();

questionRouter.post("/", verifyUser, questionController.createQuestion);
questionRouter.get("/", questionController.getAllQuestions);
questionRouter.get("/:questionId", questionController.getQuestionById);
questionRouter.put(
  "/:questionId",
  verifyUser,
  verifyAuthor,
  questionController.updateQuestion,
);
questionRouter.delete(
  "/:questionId",
  verifyUser,
  verifyAuthor,
  questionController.deleteQuestion,
);

export default questionRouter;
