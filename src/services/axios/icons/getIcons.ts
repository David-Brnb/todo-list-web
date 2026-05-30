import type { IconDTO } from "@/types/icons/iconDTO";
import api from "../api";

export const getIcons = async (): Promise<IconDTO[]> => {
  try {
    const response = await api.get<IconDTO[]>("/icon");
    return response.data;
  } catch (error) {
    console.error("Error fetching icons:", error);
    return [];
  }
};
