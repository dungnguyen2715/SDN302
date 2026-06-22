import { Schema, model, Document, Types } from "mongoose";

export interface IQuestion extends Document {
  text: string;
  options: string[];
  keywords: string[];
  correctAnswerIndex: number;
  author: Types.ObjectId;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    text: { type: String, required: true },
    options: { type: [String], required: true },
    keywords: { type: [String], default: [] },
    correctAnswerIndex: { type: Number, required: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export const Question = model<IQuestion>("Question", QuestionSchema);
