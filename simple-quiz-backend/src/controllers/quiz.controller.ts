import { Request, Response } from "express";
import { Quiz } from "../models/quiz.model";
import { Question } from "../models/question.model";
import { AuthRequest } from "../middlewares/authenticate";

export const quizController = {
  // POST /quizzes - Tạo mới 1 Quiz trống hoặc kèm ID câu hỏi có sẵn
  createQuiz: async (req: Request, res: Response): Promise<void> => {
    console.log("vao controller");

    try {
      const { title, description, questions } = req.body;
      const newQuiz = new Quiz({ title, description, questions });
      const savedQuiz = await newQuiz.save();
      res.status(201).json(savedQuiz);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // GET /quizzes - Lấy tất cả Quiz và BẮT BUỘC populate toàn bộ câu hỏi (Yêu cầu số 2)
  getAllQuizzes: async (req: Request, res: Response): Promise<void> => {
    try {
      const quizzes = await Quiz.find().populate("questions");
      res.status(200).json(quizzes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // GET /quizzes/:quizId - Lấy chi tiết 1 Quiz (chưa populate hoặc tùy chọn)
  getQuizById: async (req: Request, res: Response): Promise<void> => {
    try {
      const quiz = await Quiz.findById(req.params.quizId).populate("questions");
      if (!quiz) {
        res.status(404).json({ message: "Quiz not found" });
        return;
      }
      res.status(200).json(quiz);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // PUT /quizzes/:quizId - Cập nhật thông tin chung của Quiz
  updateQuiz: async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedQuiz = await Quiz.findByIdAndUpdate(
        req.params.quizId,
        req.body,
        { new: true, runValidators: true },
      );
      if (!updatedQuiz) {
        res.status(404).json({ message: "Quiz not found" });
        return;
      }
      res.status(200).json(updatedQuiz);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },


  deleteQuiz: async (req: Request, res: Response): Promise<void> => {
    try {
      const { quizId } = req.params;

      const quiz = await Quiz.findById(quizId);

      if (!quiz) {
        res.status(404).json({ message: "Quiz not found to delete" });
        return;
      }

      if (quiz.questions && quiz.questions.length > 0) {
        await Question.deleteMany({ _id: { $in: quiz.questions } });
      }

      await Quiz.findByIdAndDelete(quizId);

      res.status(200).json({
        message: "Quiz and all its associated questions deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // GET /quizzes/:quizId/populate - Chỉ lấy các câu hỏi khớp với từ khóa "capital" (Yêu cầu số 3)
  getQuizCapitalQuestions: async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const quiz = await Quiz.findById(req.params.quizId).populate({
        path: "questions",
        match: { keywords: "capital" }, // Lọc ngay trong lúc populate bằng mongoose match
      });

      if (!quiz) {
        res.status(404).json({ message: "Quiz not found" });
        return;
      }
      res.status(200).json(quiz);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // POST /quizzes/:quizId/question - Tạo 1 câu hỏi mới tinh trực tiếp VÀO TRONG một Quiz (Yêu cầu số 4)
  // POST /quizzes/:quizId/question
  addSingleQuestionToQuiz: async (
    req: AuthRequest, // BƯỚC 1: Đổi type Request thành AuthRequest (giống hàm createQuestion)
    res: Response,
  ): Promise<void> => {
    try {
      const { quizId } = req.params;
      const { text, options, keywords, correctAnswerIndex } = req.body;

      // 1. Tạo và lưu câu hỏi mới
      const newQuestion = new Question({
        text,
        options,
        keywords,
        correctAnswerIndex,
        author: req.user._id, // BƯỚC 2: THÊM DÒNG NÀY VÀO!
      });
      const savedQuestion = await newQuestion.save();

      // 2. Đẩy ID câu hỏi vào mảng questions của Quiz
      const updatedQuiz = await Quiz.findByIdAndUpdate(
        quizId,
        { $push: { questions: savedQuestion._id } },
        { new: true },
      ).populate("questions");

      if (!updatedQuiz) {
        res.status(404).json({ message: "Quiz not found" });
        return;
      }

      res
        .status(201)
        .json({ message: "Question added to Quiz", quiz: updatedQuiz });
    } catch (error: any) {
      // Nếu vẫn lỗi, backend sẽ trả về nguyên nhân cụ thể ở đây
      res.status(500).json({ message: error.message }); 
    }
  },

  // POST /quizzes/:quizId/questions - Tạo NHIỀU câu hỏi mới tinh một lúc VÀO TRONG Quiz (Yêu cầu số 5)
  addMultipleQuestionsToQuiz: async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { quizId } = req.params;
      const questionsArray = req.body; // Mảng chứa danh sách các object câu hỏi

      if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
        res
          .status(400)
          .json({ message: "Body must be a non-empty array of questions" });
        return;
      }

      // 1. Dùng insertMany để lưu đồng loạt các câu hỏi vào DB
      const savedQuestions = await Question.insertMany(questionsArray);

      // 2. Trích xuất lấy mảng các Object_id của các câu hỏi vừa tạo
      const questionIds = savedQuestions.map((q) => q._id);

      // 3. Sử dụng toán tử $each để đẩy toàn bộ mảng ID vào trường questions của Quiz
      const updatedQuiz = await Quiz.findByIdAndUpdate(
        quizId,
        { $push: { questions: { $each: questionIds } } },
        { new: true },
      ).populate("questions");

      if (!updatedQuiz) {
        res.status(404).json({ message: "Quiz not found" });
        return;
      }

      res
        .status(201)
        .json({
          message: "Multiple questions added successfully",
          quiz: updatedQuiz,
        });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};
