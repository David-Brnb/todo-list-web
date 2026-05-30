import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Avatar, IconBadge, SearchBar, TaskCard } from "@/components";
import { search } from "@/services/axios/search/search";
import { useAuthStore } from "@/stores/auth";
import type { SearchResultDTO } from "@/types/search/searchResult";

export default function Explore() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultDTO>({
    taskLists: [],
    tasks: [],
  });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce the search 300ms after the user stops typing.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const trimmed = query.trim();
      if (!trimmed) {
        setResults({ taskLists: [], tasks: [] });
        setHasSearched(false);
        return;
      }
      setLoading(true);
      try {
        setResults(await search(trimmed));
      } finally {
        setLoading(false);
        setHasSearched(true);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const hasResults =
    results.taskLists.length > 0 || results.tasks.length > 0;

  return (
    <div className="min-h-dvh">
      <div className="mx-auto w-full max-w-3xl px-5 pb-24 lg:px-8 lg:pt-8">
        <header className="flex items-center justify-between py-4">
          <h1 className="font-manrope text-3xl font-extrabold tracking-tight text-ink">
            Explore
          </h1>
          <Avatar uri={user?.firebaseImage} name={user?.fullName} size={40} />
        </header>

        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery("")}
          placeholder="Search lists and tasks..."
          className="mb-6"
        />

        {loading ? (
          <div className="flex justify-center py-12">
            <Search className="h-6 w-6 animate-pulse text-ink-muted" />
          </div>
        ) : !hasSearched ? (
          <EmptyHint message="Search across all your lists and tasks." />
        ) : !hasResults ? (
          <EmptyHint message="No results found." />
        ) : (
          <div className="flex flex-col gap-6">
            {results.taskLists.length > 0 ? (
              <section>
                <h2 className="mb-2 font-inter text-sm font-bold text-ink-secondary">
                  Lists
                </h2>
                <ul className="flex flex-col gap-2">
                  {results.taskLists.map((list) => (
                    <li key={`list-${list.id}`}>
                      <button
                        type="button"
                        onClick={() => navigate(`/tasklist/${list.id}`)}
                        className="flex w-full items-center gap-3 rounded-xl border border-surface-sunken bg-surface p-4 text-left transition hover:border-brand-soft"
                      >
                        <IconBadge
                          icon={list.icon}
                          color={list.color}
                          size={20}
                          className="h-10 w-10 rounded-lg"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-inter text-base font-semibold text-ink">
                            {list.name}
                          </p>
                          {list.description ? (
                            <p className="truncate font-inter text-xs text-ink-secondary">
                              {list.description}
                            </p>
                          ) : null}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {results.tasks.length > 0 ? (
              <section>
                <h2 className="mb-2 font-inter text-sm font-bold text-ink-secondary">
                  Tasks
                </h2>
                <ul className="flex flex-col gap-2">
                  {results.tasks.map((task) => (
                    <li key={`task-${task.id}`}>
                      <TaskCard
                        title={task.title}
                        description={task.description}
                        color={task.taskListColor || "#005BBF"}
                        completed={task.completed}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyHint({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <Search className="h-10 w-10 text-ink-subtle" />
      <p className="max-w-xs font-inter text-base text-ink-secondary">
        {message}
      </p>
    </div>
  );
}
