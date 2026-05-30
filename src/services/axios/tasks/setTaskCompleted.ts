import type { TaskDTO } from "@/types/tasks/taskDto";
import api from "../api";

export const setTaskCompleted = async (
  taskId: number,
  completed: boolean,
): Promise<TaskDTO> => {
  try {
    const response = await api.patch<TaskDTO>(`/task/${taskId}/completed`, {
      completed,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating task completed state:", error);
    throw error;
  }
};
