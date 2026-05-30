import type { TaskDTO } from "@/types/tasks/taskDto";
import api from "../api";

export const deleteTask = async (taskId: number): Promise<TaskDTO> => {
  try {
    const response = await api.delete<TaskDTO>(`/task/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
