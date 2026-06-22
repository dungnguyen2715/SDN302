import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/database";
import quizRouter from "./routes/quiz.route";
import questionRouter from "./routes/question.route";
import authRouter from "./routes/auth.route";
import { verifyUser } from "./middlewares/authenticate";
import userRouter from "./routes/user.route";
import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: ["http://localhost:5173", "https://simple-quiz-api.onrender.com"],
    credentials: true,
  }),
);
app.use(express.json());

// Đăng ký các Endpoint Routes chính thức cho hệ thống
app.use("/protected", verifyUser, (req, res) => {
  res.json({
    message: "Protected route success",
  });
});
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/quizzes", quizRouter);
app.use("/question", questionRouter);

connectDB();
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port: http://localhost:${PORT}`);
});
