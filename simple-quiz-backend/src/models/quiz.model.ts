import { Schema, model, Document, Types } from 'mongoose';

export interface IQuiz extends Document {
  title: string;
  description: string;
  questions: Types.ObjectId[];
}

const QuizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question', default: [] }],
  },
  { timestamps: true }
);

export const Quiz = model<IQuiz>('Quiz', QuizSchema);