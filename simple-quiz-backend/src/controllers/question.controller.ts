import { Request, Response } from "express";
import { Question } from "../models/question.model";
import { AuthRequest } from "../middlewares/authenticate";

export const questionController = {
  // POST /question - Tạo mới 1 câu hỏi độc lập
  createQuestion: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { text, options, keywords, correctAnswerIndex } = req.body;
      const newQuestion = new Question({
        text,
        options,
        keywords,
        correctAnswerIndex,
        author: req.user._id,
      });
      const savedQuestion = await newQuestion.save();
      res.status(201).json(savedQuestion);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // GET /question - Lấy danh sách toàn bộ câu hỏi
  getAllQuestions: async (req: Request, res: Response): Promise<void> => {
    try {
      const questions = await Question.find();
      res.status(200).json(questions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // GET /question/:questionId - Lấy chi tiết 1 câu hỏi
  getQuestionById: async (req: Request, res: Response): Promise<void> => {
    try {
      const question = await Question.findById(req.params.questionId);
      if (!question) {
        res.status(404).json({ message: "Question not found" });
        return;
      }
      res.status(200).json(question);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // PUT /question/:questionId - Cập nhật thông tin câu hỏi
  updateQuestion: async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedQuestion = await Question.findByIdAndUpdate(
        req.params.questionId,
        req.body,
        { new: true, runValidators: true },
      );
      if (!updatedQuestion) {
        res.status(404).json({ message: "Question not found to update" });
        return;
      }
      res.status(200).json(updatedQuestion);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // DELETE /question/:questionId - Xóa câu hỏi
  deleteQuestion: async (req: Request, res: Response): Promise<void> => {
    try {
      const deletedQuestion = await Question.findByIdAndDelete(
        req.params.questionId,
      );
      if (!deletedQuestion) {
        res.status(404).json({ message: "Question not found to delete" });
        return;
      }
      res.status(200).json({ message: "Question deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};
