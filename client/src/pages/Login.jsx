import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const data = await login(email, password);
      navigate(data.role === "admin" ? "/admin" : "/todos");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed, try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-black flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border-2 border-yellow-400 bg-neutral-900 shadow-2xl shadow-yellow-400/10 overflow-hidden">
          <div className="bg-yellow-400 px-8 py-5">
            <h1 className="text-2xl font-black text-black text-center">
              Welcome back to Jadara
            </h1>
            <p className="text-sm text-black/70 text-center font-medium">
              Log in to manage your to-dos
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-300 text-sm font-semibold">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-yellow-300 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-lg bg-black border-2 border-yellow-400/25 text-white placeholder-yellow-100/30 focus:outline-none focus:border-yellow-400 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-yellow-300 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg bg-black border-2 border-yellow-400/25 text-white placeholder-yellow-100/30 focus:outline-none focus:border-yellow-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-yellow-400 text-black font-bold text-lg hover:bg-yellow-300 disabled:opacity-50 transition-colors"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="px-8 pb-8 text-center text-sm text-yellow-100/60">
            Don't have an account?{" "}
            <Link to="/register" className="text-yellow-400 font-semibold hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}