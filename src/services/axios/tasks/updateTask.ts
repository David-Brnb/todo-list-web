import type { TaskDTO } from "@/types/tasks/taskDto";
import type { UpdateTaskDto } from "@/types/tasks/updateTaskDto";
import api from "../api";

export const updateTask = async (
  taskId: number,
  task: UpdateTaskDto,
): Promise<TaskDTO> => {
  try {
    const response = await api.patch<TaskDTO>(`/task/${taskId}`, task);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};
