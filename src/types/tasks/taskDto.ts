export interface TaskDTO {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  completed: boolean;
  taskListIds: number[];
}

export interface taskColorDto {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  completed: boolean;
  taskListIds: number[];
  taskListColor: string;
}
