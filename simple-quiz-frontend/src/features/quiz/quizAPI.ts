import api from "../../api/api";

export const getAllQuizzesAPI = async () => {
  const response = await api.get("/quizzes");

  return response.data;
};