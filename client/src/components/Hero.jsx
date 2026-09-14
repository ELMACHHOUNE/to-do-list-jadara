import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Hero() {
  const { user } = useAuth();

  return (
    <section className="bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/40 text-yellow-300 text-sm font-semibold mb-8">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          Your tasks, under control
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
          Manage your daily tasks with{" "}
          <span className="text-yellow-400">Jadara</span>
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-yellow-100/70 leading-relaxed">
          Jadara is a simple, fast and secure to-do list app. Create an account,
          organize your to-dos, mark them as done, and never lose track of what
          matters. Built with a clean yellow &amp; black design to stay focused on
          what matters — getting things done.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {user ? (
            <Link
              to="/todos"
              className="px-8 py-3.5 rounded-lg bg-yellow-400 text-black font-bold text-lg shadow-lg shadow-yellow-400/25 hover:bg-yellow-300 transition-colors"
            >
              Go to my todos
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="px-8 py-3.5 rounded-lg bg-yellow-400 text-black font-bold text-lg shadow-lg shadow-yellow-400/25 hover:bg-yellow-300 transition-colors"
              >
                Get started — it's free
              </Link>
              <Link
                to="/login"
                className="px-8 py-3.5 rounded-lg border-2 border-yellow-400 text-yellow-400 font-bold text-lg hover:bg-yellow-400 hover:text-black transition-colors"
              >
                I already have an account
              </Link>
            </>
          )}
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="rounded-xl border-2 border-yellow-400/30 bg-yellow-400/5 p-6 text-left">
            <div className="text-3xl font-black text-yellow-400 mb-2">01</div>
            <h3 className="font-bold text-white text-lg mb-1">Create &amp; manage</h3>
            <p className="text-yellow-100/60 text-sm">
              Add tasks with titles and descriptions, edit them anytime and keep
              everything organized.
            </p>
          </div>
          <div className="rounded-xl border-2 border-yellow-400/30 bg-yellow-400/5 p-6 text-left">
            <div className="text-3xl font-black text-yellow-400 mb-2">02</div>
            <h3 className="font-bold text-white text-lg mb-1">Track progress</h3>
            <p className="text-yellow-100/60 text-sm">
              Mark to-dos as completed and watch your undone list shrink one step
              at a time.
            </p>
          </div>
          <div className="rounded-xl border-2 border-yellow-400/30 bg-yellow-400/5 p-6 text-left">
            <div className="text-3xl font-black text-yellow-400 mb-2">03</div>
            <h3 className="font-bold text-white text-lg mb-1">Admin control</h3>
            <p className="text-yellow-100/60 text-sm">
              Admins manage every user account while regular users enjoy their own
              private to-do space.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}