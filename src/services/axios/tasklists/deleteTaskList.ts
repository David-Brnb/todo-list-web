import type { TaskListDTO } from "@/types/taskLists/listTaskLists";
import api from "../api";

export const deleteTaskList = async (id: number): Promise<TaskListDTO> => {
  try {
    const response = await api.delete<TaskListDTO>(`/tasklist/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting task list:", error);
    throw error;
  }
};
