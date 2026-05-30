import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  DatePicker,
  ErrorModal,
  FormScreen,
  MultilineInput,
  PrioritySelector,
  SingleLineInput,
} from "@/components";
import { registerTask } from "@/services/axios/tasks/registerTask";
import { toApiPriority, type PriorityUi } from "@/lib/priority";
import { toLocalDateTimeNoTZ } from "@/lib/date";
import type { CreateTaskDto } from "@/types/tasks/createTaskDto";

export default function TaskAdd() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const taskListId = Number(id);
  const accentColor =
    (useLocation().state as { color?: string } | null)?.color ?? "#005BBF";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // Default to now and always send a due date, mirroring the RN add-task screen.
  const [dueDate, setDueDate] = useState<Date | undefined>(() => new Date());
  const [priority, setPriority] = useState<PriorityUi>("media");
  const [loading, setLoading] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = async () => {
    if (!title.trim()) {
      setErrorMessage("The task title is required.");
      setErrorOpen(true);
      return;
    }

    setLoading(true);
    try {
      const payload: CreateTaskDto = {
        title: title.trim(),
        description: description.trim(),
        priority: toApiPriority(priority),
        completed: false,
        // TODO(verify): RN add-task assigns only the current list (no multi-select UI).
        taskListIds: [taskListId],
        dueDate: toLocalDateTimeNoTZ(dueDate ?? new Date()),
      };
      await registerTask(payload);
      navigate(-1);
    } catch {
      setErrorMessage("Couldn't create the task. Please try again.");
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormScreen title="New Task" onClose={() => navigate(-1)}>
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
          text="Save Task"
          bgColor={accentColor}
          textColor="#FFFFFF"
          onClick={handleSave}
          loading={loading}
        />
      </div>

      <ErrorModal
        open={errorOpen}
        message={errorMessage}
        onClose={() => setErrorOpen(false)}
      />
    </FormScreen>
  );
}
