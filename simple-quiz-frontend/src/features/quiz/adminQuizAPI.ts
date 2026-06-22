import api from "../../api/api";

export const createQuizAPI = async (title: string, description: string) => {
  const response = await api.post("/quizzes", {
    title,
    description,
    questions: [],
  });

  return response.data;
};

export const deleteQuizAPI = async (quizId: string) => {
  const response = await api.delete(`/quizzes/${quizId}`);

  return response.data;
};

export const updateQuizAPI = async (
  quizId: string,
  title: string,
  description: string,
) => {
  const response = await api.put(`/quizzes/${quizId}`, {
    title,
    description,
  });

  return response.data;
};

// Thêm vào file adminQuizAPI.ts
export const addSingleQuestionToQuizAPI = async (
  quizId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  questionData: any
) => {
  const response = await api.post(`/quizzes/${quizId}/question`, questionData);
  return response.data;
};