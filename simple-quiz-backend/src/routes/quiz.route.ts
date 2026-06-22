import express from "express";
import { quizController } from "../controllers/quiz.controller";
import { verifyAdmin, verifyUser } from "../middlewares/authenticate";

const quizRouter = express.Router();
console.log("vao router");

quizRouter.get("/", quizController.getAllQuizzes);
quizRouter.post("/", verifyUser, verifyAdmin, quizController.createQuiz);
quizRouter.delete(
  "/:quizId",
  verifyUser,
  verifyAdmin,
  quizController.deleteQuiz,
);
quizRouter.get("/:quizId", quizController.getQuizById);
quizRouter.put("/:quizId", verifyUser, verifyAdmin, quizController.updateQuiz);
quizRouter.get(
  "/:quizId/populate",
  verifyUser,
  verifyAdmin,
  quizController.getQuizCapitalQuestions,
);
quizRouter.post(
  "/:quizId/question",
  verifyUser,
  verifyAdmin,
  quizController.addSingleQuestionToQuiz,
);
quizRouter.post(
  "/:quizId/questions",
  quizController.addMultipleQuestionsToQuiz,
);

export default quizRouter;
