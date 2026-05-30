import type { IconDTO } from "../icons/iconDTO";

export interface TaskListDTO {
  id: number;
  name: string;
  color: string;
  description: string;
  ownerId: string;
  icon: IconDTO;
}

export interface TaskListPageDTO {
  items: TaskListDTO[];
  count: number;
  hasMore: boolean;
}
