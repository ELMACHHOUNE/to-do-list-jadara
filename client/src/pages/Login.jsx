import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { EyeIcon, EyeOffIcon } from "../components/Icons";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <section className="flex min-h-[calc(100dvh-6.4rem)] items-center justify-center bg-canvas-parchment px-4 py-16">
      <div className="w-full max-w-md">
        <div className="card animate-scale-in p-8 sm:p-10">
          <div className="mb-8 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-[24px] font-bold text-canvas">
              J
            </span>
            <h1 className="mt-5 text-[28px] font-display font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
              Welcome back
            </h1>
            <p className="mt-2 text-[14px] text-ink-muted-48">
              Log in to manage your to-dos
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-danger/10 px-4 py-3 text-[14px] font-medium text-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[13px] font-semibold text-ink-muted-80"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-[13px] font-semibold text-ink-muted-80"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-muted-48 transition-colors duration-150 ease-apple hover:text-ink active:scale-90"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full py-4">
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Logging in…
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <p className="mt-7 text-center text-[14px] text-ink-muted-48">
            Don&rsquo;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary transition-colors duration-150 ease-apple hover:text-primary-focus"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}