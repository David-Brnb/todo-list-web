import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BrandLogo,
  EmptyState,
  Fab,
  LoadingState,
  TaskListCard,
  TodayCard,
} from "@/components";
import { getTodayTasks } from "@/services/axios/tasks/getTodayTasks";
import { getUserTaskLists } from "@/services/axios/tasklists/getUserTaskLists";
import type { taskColorDto } from "@/types/tasks/taskDto";
import type { TaskListWithOldestPendingDTO } from "@/types/taskLists/taskListWithOldestPending";

export default function Home() {
  const navigate = useNavigate();

  const [today, setToday] = useState<taskColorDto[]>([]);
  const [todayLoading, setTodayLoading] = useState(true);

  const [lists, setLists] = useState<TaskListWithOldestPendingDTO[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [listsLoading, setListsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  // Synchronous guard so a double-click on "Load more" can't fetch the same page twice.
  const loadingRef = useRef(false);

  // Initial fetch: today's tasks + first page of task lists.
  useEffect(() => {
    let active = true;

    getTodayTasks()
      .then((res) => active && setToday(res))
      .catch(() => active && setToday([]))
      .finally(() => active && setTodayLoading(false));

    loadingRef.current = true;
    getUserTaskLists(1)
      .then((res) => {
        if (!active) return;
        setLists(res.items ?? []);
        setHasMore(res.hasMore ?? false);
        setPage(2);
      })
      .finally(() => {
        loadingRef.current = false;
        if (active) setListsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoadingMore(true);
    try {
      const res = await getUserTaskLists(page);
      // Dedupe by id so a list can't appear twice across page boundaries.
      setLists((prev) => {
        const seen = new Set(prev.map((l) => l.id));
        const next = (res.items ?? []).filter((l) => !seen.has(l.id));
        return [...prev, ...next];
      });
      setHasMore(res.hasMore ?? false);
      setPage((p) => p + 1);
    } finally {
      loadingRef.current = false;
      setLoadingMore(false);
    }
  }, [hasMore, page]);

  return (
    <div className="relative min-h-dvh">
      <header className="px-5 py-4 lg:hidden">
        <BrandLogo />
      </header>

      <div className="mx-auto w-full max-w-3xl px-5 pb-12 lg:px-8 lg:pt-8">
        <div className="mb-8 mt-4 lg:mt-0">
          <h1 className="font-manrope text-4xl font-extrabold tracking-tight text-ink">
            Your Atelier
          </h1>
          <p className="mt-1 font-inter text-lg text-ink-secondary">
            Focus on what matters today.
          </p>
        </div>

        {/* Due today */}
        <section className="mb-10">
          <h2 className="mb-3 font-inter text-sm font-semibold text-ink-secondary">
            Due today
          </h2>
          {todayLoading ? (
            <p className="font-inter text-sm text-ink-muted">Loading…</p>
          ) : today.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {today.map((task) => (
                <TodayCard
                  key={task.id}
                  title={task.title}
                  time={task.dueDate}
                  color={task.taskListColor}
                />
              ))}
            </div>
          ) : (
            <p className="font-inter text-sm text-ink-secondary">
              Nothing due today — enjoy the calm. 🌤️
            </p>
          )}
        </section>

        {/* Projects */}
        <section>
          <h2 className="mb-3 font-inter text-sm font-semibold text-ink-secondary">
            Projects
          </h2>

          {listsLoading ? (
            <LoadingState message="Loading your projects…" />
          ) : lists.length === 0 ? (
            <EmptyState
              title="No projects yet"
              message="Tap the + button to create your first task list."
            />
          ) : (
            <>
              <ul className="flex flex-col gap-4">
                {lists.map((list) => (
                  <li key={list.id}>
                    <button
                      type="button"
                      onClick={() => navigate(`/tasklist/${list.id}`)}
                      className="w-full"
                    >
                      <TaskListCard
                        tag={`${Math.round(list.progress)}%`}
                        title={list.name}
                        icon={list.icon}
                        color={list.color}
                        progress={list.progress / 100}
                        lastTaskTitle={list.oldestPendingTask?.title || ""}
                      />
                    </button>
                  </li>
                ))}
              </ul>

              {hasMore ? (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="rounded-xl bg-surface-muted px-5 py-2.5 font-inter text-sm font-semibold text-ink-secondary transition hover:bg-surface-sunken disabled:opacity-60"
                  >
                    {loadingMore ? "Loading…" : "Load more"}
                  </button>
                </div>
              ) : null}
            </>
          )}
        </section>
      </div>

      <Fab
        onClick={() => navigate("/tasklist/add")}
        className="fixed bottom-24 right-6 z-40 lg:bottom-10 lg:right-10"
      />
    </div>
  );
}
