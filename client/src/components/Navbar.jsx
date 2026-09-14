import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-200 ${
      isActive
        ? "bg-yellow-400 text-black"
        : "text-yellow-50 hover:bg-yellow-400/10 hover:text-yellow-300"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-black border-b-2 border-yellow-400">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="w-8 h-8 bg-yellow-400 text-black font-black text-xl flex items-center justify-center rounded-md">
                J
              </span>
              <span className="text-yellow-400 font-black text-xl tracking-tight">
                Jadara
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <NavLink to="/" end className={linkClass}>
                Home
              </NavLink>
              {user && (
                <NavLink to="/todos" className={linkClass}>
                  My Todos
                </NavLink>
              )}
              {user?.role === "admin" && (
                <NavLink to="/admin" className={linkClass}>
                  Admin Dashboard
                </NavLink>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden sm:flex items-center gap-2 text-sm text-yellow-50">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
                  {user.name}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-400 text-black font-bold uppercase">
                    {user.role}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md text-sm font-semibold bg-yellow-400 text-black hover:bg-yellow-300 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-semibold border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md text-sm font-semibold bg-yellow-400 text-black hover:bg-yellow-300 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}