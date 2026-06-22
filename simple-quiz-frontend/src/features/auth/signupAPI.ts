import api from "../../api/api";

export interface SignupRequest {
  username: string;
  password: string;
}

export const signupAPI = async (data: SignupRequest) => {
  const response = await api.post("/auth/signup", data);

  return response.data;
};
