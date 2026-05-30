import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormScreen } from "@/components";
import {
  TaskListForm,
  type TaskListFormValues,
} from "@/components/task-list-form";
import { getIcons } from "@/services/axios/icons/getIcons";
import { createList } from "@/services/axios/tasklists/registerTaskList";
import type { IconDTO } from "@/types/icons/iconDTO";

export default function TaskListAdd() {
  const navigate = useNavigate();
  const [icons, setIcons] = useState<IconDTO[]>([]);

  useEffect(() => {
    let active = true;
    getIcons().then((data) => active && setIcons(data));
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (values: TaskListFormValues) => {
    await createList({
      name: values.name,
      color: values.color,
      description: values.description,
      iconId: values.iconId,
    });
    navigate("/home");
  };

  return (
    <FormScreen title="New Task List" onClose={() => navigate(-1)}>
      <TaskListForm
        icons={icons}
        submitText="Create Task List"
        onSubmit={handleSubmit}
      />
    </FormScreen>
  );
}
