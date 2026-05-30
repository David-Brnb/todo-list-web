import api from "@/services/axios/api";
import type { TaskDTO } from "@/types/tasks/taskDto";

export const getTasksByTLId = async (
  taskListId: number,
): Promise<TaskDTO[]> => {
  try {
    const response = await api.get<TaskDTO[]>(`/tasklist/${taskListId}/task`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks", error);
    return [];
  }
};
