import type { CreateTaskDto } from "@/types/tasks/createTaskDto";
import type { TaskDTO } from "@/types/tasks/taskDto";
import api from "../api";

export const registerTask = async (task: CreateTaskDto): Promise<TaskDTO> => {
  try {
    const response = await api.post<TaskDTO>("/task", task);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};
