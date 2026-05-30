import api from "@/services/axios/api";
import type { UserDTO } from "@/types/users/userDTO";

export const getUserById = async (firebaseUuid: string): Promise<UserDTO> => {
  console.log("hi")
  const response = await api.get<UserDTO>("/user?firebaseUuid=" + firebaseUuid);
  console.log(response);
  return response.data;
};
