import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import {
  CheckIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "../components/Icons";

function ProgressRing({ pct }) {
  const r = 26;
  const c = 2 * Math.PI * r;

  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="var(--color-divider-soft)"
          strokeWidth="6"
        />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (pct / 100) * c}
          className="transition-[stroke-dashoffset] duration-700 ease-apple"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[12px] font-semibold text-ink">
        {pct}%
      </div>
    </div>
  );
}

const FILTERS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Done" },
];

export default function MyTodos() {
  const { user } = useAuth();
  const location = useLocation();

  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchTodos = useCallback(async () => {
    try {
      const res = await api.get("/api/todos");
      setTodos(res.data.todos);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load todos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    if (location.hash === "#new-task") {
      setFormOpen(true);
    }
  }, [location.hash]);

  const createTodo = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setCreating(true);
    try {
      const res = await api.post("/api/todos", { title, description });
      setTodos((prev) => [res.data.todo, ...prev]);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create todo");
    } finally {
      setCreating(false);
    }
  };

  const toggleTodo = async (todo) => {
    try {
      const res = await api.put(`/api/todos/${todo._id}`, {
        completed: !todo.completed,
      });
      setTodos((prev) =>
        prev.map((t) => (t._id === todo._id ? res.data.todo : t))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update todo");
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setConfirmDeleteId(null);
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const saveEdit = async (id) => {
    setError("");
    if (!editTitle.trim()) {
      setError("Title cannot be empty");
      return;
    }
    try {
      const res = await api.put(`/api/todos/${id}`, {
        title: editTitle,
        description: editDescription,
      });
      setTodos((prev) =>
        prev.map((t) => (t._id === id ? res.data.todo : t))
      );
      cancelEdit();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update todo");
    }
  };

  const deleteTodo = async (id) => {
    setError("");
    try {
      await api.delete(`/api/todos/${id}`);
      setTodos((prev) => prev.filter((t) => t._id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete todo");
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.length - completedCount;
  const pct = todos.length ? Math.round((completedCount / todos.length) * 100) : 0;

  const q = search.trim().toLowerCase();
  const filtered = todos.filter((t) => {
    const matchesSearch =
      !q ||
      t.title.toLowerCase().includes(q) ||
      (t.description || "").toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const emptyMessage =
    q || filter !== "all"
      ? "No to-dos match your current search and filters."
      : "You're all caught up. Add your first task and get started!";

  return (
    <section className="min-h-[calc(100dvh-6.4rem)] bg-canvas-parchment py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-display font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
              My To-Dos
            </h1>
            <p className="mt-1.5 text-[14px] text-ink-muted-48">
              Welcome back, {user.name}
            </p>
          </div>
          <ProgressRing pct={pct} />
        </div>

        {error && (
          <div className="mb-6 animate-scale-in rounded-lg bg-danger/10 px-4 py-3 text-[14px] font-medium text-danger">
            {error}
          </div>
        )}

        <div className="mb-6 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-pill border border-hairline bg-canvas p-1">
              {FILTERS.map((f) => {
                const count =
                  f.key === "all"
                    ? todos.length
                    : f.key === "active"
                      ? activeCount
                      : completedCount;
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilter(f.key)}
                    className={`rounded-pill px-4 py-2 text-[14px] font-medium transition-all duration-200 ease-apple active:scale-95 ${
                      filter === f.key
                        ? "bg-primary text-white"
                        : "text-ink-muted-80 hover:text-ink"
                    }`}
                  >
                    {f.label}
                    <span
                      className={`ml-1.5 text-[12px] ${
                        filter === f.key ? "text-white/70" : "text-ink-muted-48"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setFormOpen((v) => !v)}
              className="btn btn-primary ml-auto !py-2 text-[14px]"
            >
              <PlusIcon className="h-4 w-4" />
              {formOpen ? "Close" : "New task"}
            </button>
          </div>

          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted-48" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your tasks…"
              className="input pl-11"
            />
          </div>
        </div>

        {formOpen && (
          <form
            id="new-task"
            onSubmit={createTodo}
            className="card mb-8 animate-scale-in border-primary/20 p-6 sm:p-7"
          >
            <h2 className="text-[21px] font-semibold tracking-[0.01em] text-ink">
              Add a new task
            </h2>
            <div className="mt-5 space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                autoFocus
                className="input"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                rows="3"
                className="input resize-none"
              />
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="btn btn-pearl"
                >
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="btn btn-primary">
                  {creating ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Adding…
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-4 w-4" />
                      Add task
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="card flex items-center gap-4 p-5">
                <div className="skeleton h-[26px] w-[26px] rounded-sm bg-hairline" />
                <div className="flex-1 space-y-2.5">
                  <div className="skeleton h-4 w-1/3 bg-hairline" />
                  <div className="skeleton h-3 w-2/3 bg-hairline" />
                </div>
                <div className="skeleton h-9 w-24 rounded-pill bg-hairline" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="card animate-scale-in flex flex-col items-center px-8 py-16 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckIcon className="h-7 w-7" strokeWidth={2.5} />
              </span>
              <h3 className="mt-6 text-[21px] font-semibold tracking-[-0.01em] text-ink">
                {q || filter !== "all" ? "No results" : "No to-dos yet"}
              </h3>
              <p className="mt-2 max-w-xs text-[14px] leading-[1.5] text-ink-muted-48">
                {emptyMessage}
              </p>
              {!q && filter === "all" && (
                <button
                  type="button"
                  onClick={() => setFormOpen(true)}
                  className="btn btn-primary mt-7"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add your first task
                </button>
              )}
            </div>
          ) : (
            filtered.map((todo) => (
              <div
                key={todo._id}
                className={`card p-5 transition-all duration-300 ease-apple animate-scale-in sm:p-6 ${
                  editingId === todo._id
                    ? "border-primary-focus/40"
                    : "hover:border-ink-muted-48/25"
                }`}
              >
                {editingId === todo._id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="input"
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows="2"
                      placeholder="Description (optional)"
                      className="input resize-none"
                    />
                    <div className="flex justify-end gap-3">
                      <button onClick={cancelEdit} className="btn btn-pearl">
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(todo._id)}
                        className="btn btn-primary !py-2 text-[14px]"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <button
                      type="button"
                      onClick={() => toggleTodo(todo)}
                      aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                      className={`mt-0.5 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-sm border transition-all duration-200 ease-apple active:scale-90 ${
                        todo.completed
                          ? "border-primary bg-primary text-white"
                          : "border-hairline bg-canvas text-transparent hover:border-primary"
                      }`}
                    >
                      {todo.completed && (
                        <CheckIcon className="h-4 w-4 animate-pop" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`break-words text-[17px] font-semibold tracking-[-0.01em] transition-colors duration-200 ${
                          todo.completed
                            ? "text-ink-muted-48 line-through"
                            : "text-ink"
                        }`}
                      >
                        {todo.title}
                      </p>
                      {todo.description && (
                        <p
                          className={`mt-1 break-words text-[15px] leading-[1.5] transition-colors duration-200 ${
                            todo.completed
                              ? "text-ink-muted-48"
                              : "text-ink-muted-80"
                          }`}
                        >
                          {todo.description}
                        </p>
                      )}
                      <p className="mt-2.5 text-[12px] tracking-[-0.005em] text-ink-muted-48">
                        {new Date(todo.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      {confirmDeleteId === todo._id ? (
                        <div className="animate-pop flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => deleteTodo(todo._id)}
                            className="btn btn-danger !px-4"
                          >
                            <TrashIcon className="h-4 w-4" />
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="btn btn-pearl"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(todo)}
                            className="btn btn-pearl !px-3.5"
                          >
                            <PencilIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(todo._id)}
                            className="btn btn-pearl !px-3.5 text-danger hover:bg-danger/5"
                            aria-label={`Delete ${todo.title}`}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}