import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import {
  CheckIcon,
  ListIcon,
  PencilIcon,
  ShieldIcon,
  TrashIcon,
  UserIcon,
  UsersIcon,
} from "../components/Icons";

const ROLE_BADGE = {
  admin: "bg-primary text-white",
  user: "border border-hairline text-ink-muted-80",
};

function StatCard({ icon: Icon, label, value, tint }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const duration = 800;

    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <div className="card p-6 transition-transform duration-300 ease-apple hover:-translate-y-1">
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-md ${tint}`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-4 text-[34px] font-display font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
        {display}
      </p>
      <p className="mt-1 text-[13px] font-medium text-ink-muted-48">{label}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        api.get("/api/admin/users"),
        api.get("/api/admin/stats"),
      ]);
      setUsers(usersRes.data.users);
      setStats(statsRes.data.stats);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const startEdit = (user) => {
    setEditingId(user._id);
    setConfirmDeleteId(null);
    setEditName(user.name);
    setEditRole(user.role);
    setEditPassword("");
    setError("");
    setSuccess("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditRole("");
    setEditPassword("");
    setError("");
    setSuccess("");
  };

  const saveEdit = async (id) => {
    setError("");
    setSuccess("");

    if (!editName.trim()) {
      setError("Name cannot be empty");
      return;
    }

    const payload = { name: editName.trim(), role: editRole };
    if (editPassword.trim()) {
      if (editPassword.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      payload.password = editPassword;
    }

    try {
      const res = await api.put(`/api/admin/users/${id}`, payload);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, ...res.data.user } : u))
      );
      setSuccess("User updated successfully");
      cancelEdit();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
    }
  };

  const deleteUser = async (user) => {
    setError("");
    setSuccess("");
    try {
      await api.delete(`/api/admin/users/${user._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
      setConfirmDeleteId(null);
      setSuccess(`User "${user.name}" and all of their to-dos were deleted`);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <section className="min-h-[calc(100dvh-6.4rem)] bg-canvas-parchment py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-[32px] font-display font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
            Admin Dashboard
          </h1>
          <p className="mt-1.5 text-[14px] text-ink-muted-48">
            Manage all users and their accounts.
          </p>
        </div>

        {error && (
          <div className="mb-6 animate-scale-in rounded-lg bg-danger/10 px-4 py-3 text-[14px] font-medium text-danger">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 animate-scale-in rounded-lg bg-success/10 px-4 py-3 text-[14px] font-medium text-success">
            {success}
          </div>
        )}

        {stats && (
          <div className="mb-10 grid grid-cols-2 gap-5 lg:grid-cols-5">
            <StatCard
              icon={UsersIcon}
              label="Total Users"
              value={stats.totalUsers}
              tint="bg-primary/10 text-primary"
            />
            <StatCard
              icon={ShieldIcon}
              label="Admins"
              value={stats.adminCount}
              tint="bg-primary/10 text-primary"
            />
            <StatCard
              icon={UserIcon}
              label="Regular Users"
              value={stats.userCount}
              tint="bg-primary/10 text-primary"
            />
            <StatCard
              icon={ListIcon}
              label="Total To-Dos"
              value={stats.totalTodos}
              tint="bg-primary/10 text-primary"
            />
            <StatCard
              icon={CheckIcon}
              label="Completed"
              value={stats.completedTodos}
              tint="bg-success/10 text-success"
            />
          </div>
        )}

        <div className="card overflow-hidden">
          <div className="hidden grid-cols-12 gap-4 border-b border-divider-soft px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.05em] text-ink-muted-48 md:grid">
            <div className="col-span-3">Name</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Joined</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {loading ? (
            <div className="space-y-4 p-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="skeleton h-4 w-40 bg-hairline" />
                  <div className="skeleton h-4 w-56 bg-hairline" />
                  <div className="skeleton h-6 w-16 rounded-pill bg-hairline" />
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-divider-soft">
              {users.map((user) => (
                <div key={user._id} className="px-6 py-4">
                  {editingId === user._id ? (
                    <div className="space-y-3 md:flex md:items-end md:gap-3 md:space-y-0">
                      <div className="flex-1">
                        <label className="mb-1.5 block text-[12px] font-semibold text-ink-muted-80">
                          Name
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="input"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="mb-1.5 block text-[12px] font-semibold text-ink-muted-80">
                          Role
                        </label>
                        <select
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          className="input"
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="mb-1.5 block text-[12px] font-semibold text-ink-muted-80">
                          New password (optional)
                        </label>
                        <input
                          type="password"
                          value={editPassword}
                          onChange={(e) => setEditPassword(e.target.value)}
                          placeholder="Leave blank to keep"
                          className="input"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(user._id)}
                          className="btn btn-primary !px-4 !py-2 text-[14px]"
                        >
                          Save
                        </button>
                        <button onClick={cancelEdit} className="btn btn-pearl">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-12 md:gap-4">
                      <div className="col-span-3">
                        <p className="break-words text-[15px] font-semibold text-ink">
                          {user.name}
                        </p>
                      </div>
                      <div className="col-span-3">
                        <p className="break-words text-[14px] text-ink-muted-48">
                          {user.email}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span
                          className={`badge px-3 py-1 uppercase ${ROLE_BADGE[user.role]}`}
                        >
                          {user.role}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[14px] text-ink-muted-48">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="col-span-2 flex justify-start gap-1.5 md:justify-end">
                        {confirmDeleteId === user._id ? (
                          <div className="animate-pop flex items-center gap-2">
                            <span className="hidden text-[13px] text-ink-muted-48 sm:inline">
                              Delete?
                            </span>
                            <button
                              onClick={() => deleteUser(user)}
                              className="btn btn-danger !px-3.5"
                            >
                              <TrashIcon className="h-4 w-4" />
                              Delete
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="btn btn-pearl"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(user)}
                              className="btn btn-pearl !px-3.5"
                            >
                              <PencilIcon className="h-4 w-4" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(user._id)}
                              className="btn btn-pearl !px-3.5 text-danger hover:bg-danger/5"
                              aria-label={`Delete ${user.name}`}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}