import type { createListDto } from "@/types/taskLists/createListDto";
import api from "../api";

export const createList = async (task: createListDto): Promise<void> => {
  try {
    await api.post("/tasklist", task);
  } catch (error) {
    console.error("Error creating task list:", error);
    throw error;
  }
};
