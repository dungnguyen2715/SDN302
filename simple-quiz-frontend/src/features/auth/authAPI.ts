import api from "../../api/api";

export interface LoginRequest {
  username: string;
  password: string;
}

export const loginAPI = async (data: LoginRequest) => {
  const response = await api.post("/auth/login", data);
  console.log("res: ", response);

  return response.data;
};
