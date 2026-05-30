import type { taskColorDto } from "@/types/tasks/taskDto";
import api from "../api";

export const getTodayTasks = async (): Promise<taskColorDto[]> => {
  const response = await api.get<taskColorDto[]>("/task/today");
  return response.data;
};
