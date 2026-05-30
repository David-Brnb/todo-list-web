import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DeleteConfirmModal,
  EmptyState,
  Fab,
  LoadingState,
  TaskCard,
  TaskListHeader,
} from "@/components";
import { getTaskList } from "@/services/axios/tasklists/getTaskList";
import { getTasksByTLId } from "@/services/axios/tasklists/getTaskListTasks";
import { deleteTaskList } from "@/services/axios/tasklists/deleteTaskList";
import { setTaskCompleted } from "@/services/axios/tasks/setTaskCompleted";
import { deleteTask } from "@/services/axios/tasks/deleteTask";
import type { TaskListDTO } from "@/types/taskLists/listTaskLists";
import type { TaskDTO } from "@/types/tasks/taskDto";

export default function TaskListDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const taskListId = Number(id);

  const [taskList, setTaskList] = useState<TaskListDTO | null>(null);
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [listDeleteOpen, setListDeleteOpen] = useState(false);
  const [listMenuOpen, setListMenuOpen] = useState(false);
  const listMenuRef = useRef<HTMLDivElement>(null);

  const fetchTasks = useCallback(async () => {
    const res = await getTasksByTLId(taskListId);
    // Dedupe by id so no two rows ever share a key.
    setTasks(Array.from(new Map(res.map((t) => [t.id, t])).values()));
  }, [taskListId]);

  // Initial load — list metadata + its tasks. Re-runs if the id changes.
  useEffect(() => {
    let active = true;
    // Intentional loading toggle so re-fetches (id change) re-show the spinner;
    // can't be derived during render since it tracks an async fetch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    Promise.all([
      getTaskList(taskListId)
        .then((res) => active && setTaskList(res))
        .catch(() => active && setTaskList(null)),
      fetchTasks(),
    ]).finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [taskListId, fetchTasks]);

  // Close the list "..." menu on outside click / ESC.
  useEffect(() => {
    if (!listMenuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (listMenuRef.current && !listMenuRef.current.contains(e.target as Node)) {
        setListMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setListMenuOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [listMenuOpen]);

  const accentColor = taskList?.color || "#005BBF";
  const remainingCount = tasks.filter((t) => !t.completed).length;

  // Optimistically flip "done", persist, roll back on failure.
  const handleToggle = async (taskId: number) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;
    const next = !target.completed;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: next } : t)),
    );
    try {
      await setTaskCompleted(taskId, next);
    } catch {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, completed: target.completed } : t,
        ),
      );
    }
  };

  // Optimistically remove the task; refetch to restore if the delete fails.
  const handleConfirmDeleteTask = async () => {
    if (taskToDelete == null) return;
    const deletedId = taskToDelete;
    setTaskToDelete(null);
    setTasks((prev) => prev.filter((t) => t.id !== deletedId));
    try {
      await deleteTask(deletedId);
    } catch {
      fetchTasks();
    }
  };

  const handleConfirmDeleteList = async () => {
    setListDeleteOpen(false);
    try {
      await deleteTaskList(taskListId);
      navigate("/home");
    } catch {
      // Stay on the screen if the delete fails.
    }
  };

  return (
    <div className="relative min-h-dvh">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 lg:px-8">
        <button
          type="button"
          aria-label="Back"
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-sunken text-ink-secondary transition hover:opacity-80"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="relative" ref={listMenuRef}>
          <button
            type="button"
            aria-label="List options"
            onClick={() => setListMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-sunken text-ink-secondary transition hover:opacity-80"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
          {listMenuOpen ? (
            <div className="absolute right-0 top-11 z-20 w-44 overflow-hidden rounded-xl border border-border-soft bg-surface shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setListMenuOpen(false);
                  navigate(`/tasklist/${taskListId}/edit`);
                }}
                className="flex w-full items-center gap-3 border-b border-border-soft px-4 py-3 text-left font-inter text-sm text-ink transition hover:bg-surface-muted"
              >
                <Pencil className="h-4 w-4" />
                Edit list
              </button>
              <button
                type="button"
                onClick={() => {
                  setListMenuOpen(false);
                  setListDeleteOpen(true);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left font-inter text-sm text-danger transition hover:bg-surface-muted"
              >
                <Trash2 className="h-4 w-4" />
                Delete list
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl px-6 pb-28">
        {loading ? (
          <LoadingState color={accentColor} message="Loading tasks…" />
        ) : (
          <>
            <TaskListHeader
              title={taskList?.name || ""}
              description={taskList?.description || ""}
              color={accentColor}
              icon={taskList?.icon}
            />

            <div className="flex items-center justify-between pb-4 pt-8">
              <h2 className="font-inter text-lg font-bold text-ink">
                Tasks in progress
              </h2>
              <span
                className="rounded-full px-3 py-1 font-inter text-xs font-semibold text-white"
                style={{ backgroundColor: "#636363" }}
              >
                {remainingCount} pending
              </span>
            </div>

            {tasks.length === 0 ? (
              <EmptyState
                title="No tasks yet"
                message="Add your first task with the + button below."
              />
            ) : (
              <ul className="flex flex-col gap-3">
                {tasks.map((task) => (
                  <li key={task.id}>
                    <TaskCard
                      title={task.title}
                      description={task.description}
                      color={accentColor}
                      icon={taskList?.icon}
                      completed={task.completed}
                      onToggle={() => handleToggle(task.id)}
                      onUpdate={() =>
                        navigate(
                          `/tasklist/${taskListId}/task/${task.id}/edit`,
                          { state: { color: accentColor } },
                        )
                      }
                      onDelete={() => setTaskToDelete(task.id)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      <Fab
        onClick={() =>
          navigate(`/tasklist/${taskListId}/task/add`, {
            state: { color: accentColor },
          })
        }
        color={accentColor}
        label="Add task"
        className="fixed bottom-24 right-6 z-40 lg:bottom-10 lg:right-10"
      />

      <DeleteConfirmModal
        open={taskToDelete !== null}
        onConfirm={handleConfirmDeleteTask}
        onClose={() => setTaskToDelete(null)}
      />

      <DeleteConfirmModal
        open={listDeleteOpen}
        title="Delete list?"
        message="This action can't be undone. The list and its tasks will be permanently deleted."
        confirmText="Delete list"
        onConfirm={handleConfirmDeleteList}
        onClose={() => setListDeleteOpen(false)}
      />
    </div>
  );
}
