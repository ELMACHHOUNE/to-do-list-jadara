import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";

const ROLE_BADGE = {
  admin: "bg-yellow-400 text-black",
  user: "bg-yellow-400/10 text-yellow-300 border border-yellow-400/40",
};

function StatCard({ label, value, color }) {
  return (
    <div className={`rounded-xl border-2 p-5 ${color}`}>
      <p className="text-3xl font-black text-white">{value}</p>
      <p className="text-sm font-semibold text-yellow-100/60 mt-1">{label}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [editingId, setEditingId] = useState(null);
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
    if (
      !window.confirm(
        `Delete user "${user.name}" and all of their to-dos? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await api.delete(`/api/admin/users/${user._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
      setSuccess("User deleted");
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-black py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white">
            Admin <span className="text-yellow-400">Dashboard</span>
          </h1>
          <p className="text-yellow-100/60 mt-1">
            Manage all users and their accounts.
          </p>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-300 text-sm font-semibold mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-sm font-semibold mb-6">
            {success}
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            <StatCard label="Total Users" value={stats.totalUsers} color="border-yellow-400/40 bg-yellow-400/5" />
            <StatCard label="Admins" value={stats.adminCount} color="border-yellow-400 bg-yellow-400/10" />
            <StatCard label="Regular Users" value={stats.userCount} color="border-yellow-400/40 bg-yellow-400/5" />
            <StatCard label="Total To-Dos" value={stats.totalTodos} color="border-yellow-400/40 bg-yellow-400/5" />
            <StatCard label="Completed" value={stats.completedTodos} color="border-emerald-500/40 bg-emerald-500/5" />
          </div>
        )}

        <div className="rounded-2xl border-2 border-yellow-400 overflow-hidden">
          <div className="bg-yellow-400 px-6 py-4">
            <h2 className="font-black text-black text-lg">All Users</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-16 bg-neutral-900">
              <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="bg-neutral-900 divide-y divide-yellow-400/10">
              <div className="hidden md:grid grid-cols-12 px-6 py-3 text-xs font-bold text-yellow-300 uppercase tracking-wide">
                <div className="col-span-3">Name</div>
                <div className="col-span-3">Email</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2">Joined</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {users.map((user) => (
                <div key={user._id} className="px-6 py-4">
                  {editingId === user._id ? (
                    <div className="space-y-3 md:space-y-0 md:flex md:items-end md:gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-yellow-300 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-black border-2 border-yellow-400 text-white text-sm focus:outline-none"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-yellow-300 mb-1">
                          Role
                        </label>
                        <select
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-black border-2 border-yellow-400 text-white text-sm focus:outline-none"
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-yellow-300 mb-1">
                          New password (optional)
                        </label>
                        <input
                          type="password"
                          value={editPassword}
                          onChange={(e) => setEditPassword(e.target.value)}
                          placeholder="Leave blank to keep"
                          className="w-full px-3 py-2 rounded-lg bg-black border-2 border-yellow-400/25 text-white text-sm placeholder-yellow-100/30 focus:outline-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(user._id)}
                          className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2 rounded-lg border-2 border-yellow-100/30 text-yellow-100/70 font-semibold text-sm hover:border-yellow-400 hover:text-yellow-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-0 items-center">
                      <div className="col-span-3">
                        <p className="font-bold text-white text-sm break-words">{user.name}</p>
                      </div>
                      <div className="col-span-3">
                        <p className="text-yellow-100/60 text-sm break-words">{user.email}</p>
                      </div>
                      <div className="col-span-2">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                            ROLE_BADGE[user.role]
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <p className="text-yellow-100/40 text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="col-span-2 flex gap-2 md:justify-end mt-2 md:mt-0">
                        <button
                          onClick={() => startEdit(user)}
                          className="px-3 py-1.5 rounded-md text-sm font-semibold border border-yellow-400/40 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteUser(user)}
                          className="px-3 py-1.5 rounded-md text-sm font-semibold border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                        >
                          Delete
                        </button>
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