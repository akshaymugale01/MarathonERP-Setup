import axiosInstance from "../../lib/axios";

type loginKey = {
  email: string;
  password?: string;
  otp?: string;
};

export async function loginApi(data: loginKey): Promise<unknown> {
  const response = await axiosInstance.post("/users/sign_in.json", {
    user: data
  });
  return response.data;
}
