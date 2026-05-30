import type { TaskDTO } from "@/types/tasks/taskDto";
import api from "../api";

export const getTaskById = async (taskId: number): Promise<TaskDTO> => {
  try {
    const response = await api.get<TaskDTO>(`/task/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw error;
  }
};
