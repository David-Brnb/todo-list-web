import type { TaskListDTO } from "../taskLists/listTaskLists";
import type { taskColorDto } from "../tasks/taskDto";

export interface SearchResultDTO {
  taskLists: TaskListDTO[];
  tasks: taskColorDto[];
}
