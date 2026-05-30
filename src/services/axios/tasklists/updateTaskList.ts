import type { TaskListDTO } from "@/types/taskLists/listTaskLists";
import type { UpdateTaskListDto } from "@/types/taskLists/updateTaskListDto";
import api from "../api";

export const updateTaskList = async (
  id: number,
  dto: UpdateTaskListDto,
): Promise<TaskListDTO> => {
  try {
    const response = await api.patch<TaskListDTO>(`/tasklist/${id}`, dto);
    return response.data;
  } catch (error) {
    console.error("Error updating task list:", error);
    throw error;
  }
};
