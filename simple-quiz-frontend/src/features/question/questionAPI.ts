import api from "../../api/api";

// Lấy danh sách toàn bộ câu hỏi
export const getAllQuestionsAPI = async () => {
  const response = await api.get("/question");
  
  return response.data;
};

// Tạo một câu hỏi mới độc lập
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createQuestionAPI = async (questionData: any) => {
  const response = await api.post("/question", questionData);
  
  return response.data;
};

// Cập nhật thông tin câu hỏi
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateQuestionAPI = async (questionId: string, questionData: any) => {
  const response = await api.put(`/question/${questionId}`, questionData);
  
  return response.data;
};

// Xóa câu hỏi
export const deleteQuestionAPI = async (questionId: string) => {
  const response = await api.delete(`/question/${questionId}`);
  
  return response.data;
};

// (Tùy chọn) Nếu bạn muốn gọi API thêm câu hỏi trực tiếp vào Quiz từ trang quản lý câu hỏi
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addSingleQuestionToQuizAPI = async (quizId: string, questionData: any) => {
  const response = await api.post(`/quizzes/${quizId}/question`, questionData);
  
  return response.data;
};