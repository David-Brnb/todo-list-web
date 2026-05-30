import type { TaskListWithOldestPendingPageDTO } from "@/types/taskLists/taskListWithOldestPending";
import api from "../api";

const EMPTY_PAGE: TaskListWithOldestPendingPageDTO = {
  items: [],
  count: 0,
  hasMore: false,
};

export const getUserTaskLists = async (
  page: number,
): Promise<TaskListWithOldestPendingPageDTO> => {
  try {
    const response = await api.get<TaskListWithOldestPendingPageDTO>(
      "/tasklist/with-oldest-pending?page=" + page,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user task lists:", error);
    return EMPTY_PAGE;
  }
};
