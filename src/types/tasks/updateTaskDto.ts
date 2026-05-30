export interface UpdateTaskDto {
  title: string;
  description?: string;
  // ISO LocalDateTime (no timezone), e.g. "2026-05-28T14:30:00"
  dueDate?: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  completed: boolean;
  taskListIds: number[];
}
