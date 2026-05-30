import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorState, FormScreen, LoadingState } from "@/components";
import {
  TaskListForm,
  type TaskListFormValues,
} from "@/components/task-list-form";
import { getIcons } from "@/services/axios/icons/getIcons";
import { getTaskList } from "@/services/axios/tasklists/getTaskList";
import { updateTaskList } from "@/services/axios/tasklists/updateTaskList";
import type { IconDTO } from "@/types/icons/iconDTO";

export default function TaskListEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const taskListId = Number(id);

  const [icons, setIcons] = useState<IconDTO[]>([]);
  const [initial, setInitial] = useState<TaskListFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([getIcons(), getTaskList(taskListId)])
      .then(([iconList, list]) => {
        if (!active) return;
        setIcons(iconList);
        if (list) {
          setInitial({
            name: list.name,
            color: list.color,
            description: list.description,
            iconId: list.icon?.id ?? 0,
          });
        } else {
          setLoadError(true);
        }
      })
      .catch(() => active && setLoadError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [taskListId]);

  const handleSubmit = async (values: TaskListFormValues) => {
    await updateTaskList(taskListId, {
      name: values.name,
      color: values.color,
      description: values.description,
      iconId: values.iconId,
    });
    navigate(-1);
  };

  return (
    <FormScreen title="Edit Task List" onClose={() => navigate(-1)}>
      {loading ? (
        <LoadingState message="Loading list…" />
      ) : loadError || !initial ? (
        <ErrorState message="Couldn't load the list. Please try again." />
      ) : (
        <TaskListForm
          icons={icons}
          submitText="Save Changes"
          initial={initial}
          onSubmit={handleSubmit}
        />
      )}
    </FormScreen>
  );
}
