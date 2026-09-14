import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function MyTodos() {
  const { user } = useAuth();

  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

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
    if (!window.confirm("Are you sure you want to delete this to-do?")) return;
    try {
      await api.delete(`/api/todos/${id}`);
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete todo");
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">
              My <span className="text-yellow-400">To-Dos</span>
            </h1>
            <p className="text-yellow-100/60 mt-1">
              Welcome back, {user.name}
            </p>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="px-3 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/40 text-yellow-300 font-semibold">
              Total: {todos.length}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 font-semibold">
              Done: {completedCount}
            </span>
          </div>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-300 text-sm font-semibold mb-6">
            {error}
          </div>
        )}

        <form
          onSubmit={createTodo}
          className="rounded-2xl border-2 border-yellow-400 bg-neutral-900 p-6 mb-8"
        >
          <h2 className="text-lg font-bold text-yellow-400 mb-4">Add a new task</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full px-4 py-2.5 rounded-lg bg-black border-2 border-yellow-400/25 text-white placeholder-yellow-100/30 focus:outline-none focus:border-yellow-400 transition-colors"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              rows="3"
              className="w-full px-4 py-2.5 rounded-lg bg-black border-2 border-yellow-400/25 text-white placeholder-yellow-100/30 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
            />
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2.5 rounded-lg bg-yellow-400 text-black font-bold hover:bg-yellow-300 disabled:opacity-50 transition-colors"
            >
              {creating ? "Adding..." : "+ Add task"}
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border-2 border-dashed border-yellow-400/30 bg-yellow-400/5">
              <p className="text-5xl mb-4">✓</p>
              <p className="text-xl font-bold text-white">No to-dos yet</p>
              <p className="text-yellow-100/60 mt-1">
                Add your first task above and get started!
              </p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo._id}
                className={`rounded-xl border-2 p-5 transition-colors ${
                  todo.completed
                    ? "border-yellow-400/20 bg-neutral-900/50"
                    : "border-yellow-400/40 bg-neutral-900"
                }`}
              >
                {editingId === todo._id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-black border-2 border-yellow-400 text-white focus:outline-none"
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows="2"
                      placeholder="Description (optional)"
                      className="w-full px-4 py-2 rounded-lg bg-black border-2 border-yellow-400/30 text-white focus:outline-none resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(todo._id)}
                        className="px-4 py-1.5 rounded-md bg-yellow-400 text-black font-semibold text-sm hover:bg-yellow-300 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-1.5 rounded-md border-2 border-yellow-100/30 text-yellow-100/70 font-semibold text-sm hover:border-yellow-400 hover:text-yellow-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo)}
                        className="mt-1.5 w-5 h-5 accent-yellow-400 cursor-pointer"
                      />
                      <div className="min-w-0">
                        <p
                          className={`font-bold break-words ${
                            todo.completed
                              ? "text-yellow-100/40 line-through"
                              : "text-white"
                          }`}
                        >
                          {todo.title}
                        </p>
                        {todo.description && (
                          <p
                            className={`text-sm mt-0.5 break-words ${
                              todo.completed
                                ? "text-yellow-100/30"
                                : "text-yellow-100/60"
                            }`}
                          >
                            {todo.description}
                          </p>
                        )}
                        <p className="text-xs text-yellow-100/30 mt-2">
                          {new Date(todo.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => startEdit(todo)}
                        className="px-3 py-1.5 rounded-md text-sm font-semibold border border-yellow-400/40 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTodo(todo._id)}
                        className="px-3 py-1.5 rounded-md text-sm font-semibold border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        Delete
                      </button>
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