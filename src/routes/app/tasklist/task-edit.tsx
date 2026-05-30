import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  DatePicker,
  ErrorModal,
  FormScreen,
  LoadingState,
  MultilineInput,
  PrioritySelector,
  SingleLineInput,
} from "@/components";
import { getTaskById } from "@/services/axios/tasks/getTaskById";
import { updateTask } from "@/services/axios/tasks/updateTask";
import { toApiPriority, toUiPriority, type PriorityUi } from "@/lib/priority";
import { toLocalDateTimeNoTZ } from "@/lib/date";
import type { UpdateTaskDto } from "@/types/tasks/updateTaskDto";

export default function TaskEdit() {
  const navigate = useNavigate();
  const { taskId: taskIdParam } = useParams<{ taskId: string }>();
  const taskId = Number(taskIdParam);
  const accentColor =
    (useLocation().state as { color?: string } | null)?.color ?? "#005BBF";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // Default to now; overwritten by the task's own due date once it loads.
  const [dueDate, setDueDate] = useState<Date | undefined>(() => new Date());
  const [priority, setPriority] = useState<PriorityUi>("media");
  const [completed, setCompleted] = useState(false);
  const [taskListIds, setTaskListIds] = useState<number[]>([]);

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;
    getTaskById(taskId)
      .then((task) => {
        if (!active) return;
        setTitle(task.title);
        setDescription(task.description || "");
        setPriority(toUiPriority(task.priority));
        setCompleted(task.completed);
        setTaskListIds(task.taskListIds || []);
        if (task.dueDate) setDueDate(new Date(task.dueDate));
      })
      .catch(() => {
        if (!active) return;
        setErrorMessage("Couldn't load the task.");
        setErrorOpen(true);
      })
      .finally(() => active && setInitialLoading(false));
    return () => {
      active = false;
    };
  }, [taskId]);

  const handleUpdate = async () => {
    if (!title.trim()) {
      setErrorMessage("The task title is required.");
      setErrorOpen(true);
      return;
    }

    setLoading(true);
    try {
      const payload: UpdateTaskDto = {
        title: title.trim(),
        description: description.trim(),
        priority: toApiPriority(priority),
        completed,
        taskListIds,
        dueDate: toLocalDateTimeNoTZ(dueDate ?? new Date()),
      };
      await updateTask(taskId, payload);
      navigate(-1);
    } catch {
      setErrorMessage("Couldn't update the task. Please try again.");
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormScreen title="Edit Task" onClose={() => navigate(-1)}>
      {initialLoading ? (
        <LoadingState color={accentColor} message="Loading task…" />
      ) : (
        <div className="flex flex-col gap-5">
          <SingleLineInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Finish the report"
            maxLength={80}
            showCounter={false}
          />
          <MultilineInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Add more details..."
            maxLength={200}
          />
          <DatePicker
            label="Due Date"
            value={dueDate}
            onChange={setDueDate}
            accentColor={accentColor}
          />
          <PrioritySelector value={priority} onChange={setPriority} />
          <Button
            text="Save Changes"
            bgColor={accentColor}
            textColor="#FFFFFF"
            onClick={handleUpdate}
            loading={loading}
          />
        </div>
      )}

      <ErrorModal
        open={errorOpen}
        message={errorMessage}
        onClose={() => setErrorOpen(false)}
      />
    </FormScreen>
  );
}
