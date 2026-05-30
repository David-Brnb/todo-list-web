import api from "@/services/axios/api";
import type { TaskListDTO } from "@/types/taskLists/listTaskLists";

export const getTaskList = async (id: number): Promise<TaskListDTO | null> => {
  try {
    const response = await api.get<TaskListDTO>(`/tasklist/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching task list:", error);
    throw error;
  }
};
