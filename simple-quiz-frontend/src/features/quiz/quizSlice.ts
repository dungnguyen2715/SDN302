import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Question {
  _id: string;
  text: string;
  options: string[];
  keywords: string[];
  correctAnswerIndex: number;
}

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface QuizState {
  quizzes: Quiz[];
  selectedQuiz: Quiz | null;
  loading: boolean;
  error: string | null;
}

const initialState: QuizState = {
  quizzes: [],
  selectedQuiz: null,
  loading: false,
  error: null,
};

const quizSlice = createSlice({
  name: "quiz",

  initialState,

  reducers: {
    setQuizzes: (state, action: PayloadAction<Quiz[]>) => {
      state.quizzes = action.payload;
    },

    setSelectedQuiz: (state, action: PayloadAction<Quiz>) => {
      state.selectedQuiz = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setQuizzes, setSelectedQuiz, setLoading, setError } =
  quizSlice.actions;

export default quizSlice.reducer;
