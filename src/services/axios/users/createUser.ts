import api from "@/services/axios/api";
import type { CreateUserDTO } from "@/types/users/createUserDTO";
import type { UserDTO } from "@/types/users/userDTO";

export const createUser = async (data: CreateUserDTO): Promise<UserDTO> => {
  const response = await api.post<UserDTO>("/user", data);
  return response.data;
};
