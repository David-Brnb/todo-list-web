import type { IconDTO } from "../icons/iconDTO";

export interface BackendTaskDTO {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  isCompleted: boolean;
  taskListIds: number[];
  taskListColor?: string;
}

export interface TaskListWithOldestPendingDTO {
  id: number;
  name: string;
  color: string;
  description: string;
  ownerId: string | null;
  icon: IconDTO | null;
  oldestPendingTask: BackendTaskDTO | null;
  progress: number;
}

export interface TaskListWithOldestPendingPageDTO {
  items: TaskListWithOldestPendingDTO[];
  count: number;
  hasMore: boolean;
}
