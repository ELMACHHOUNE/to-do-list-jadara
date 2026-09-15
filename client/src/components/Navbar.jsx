import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MenuIcon, CloseIcon, PlusIcon } from "./Icons";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/");
  };

  const section = location.pathname.startsWith("/admin")
    ? "Admin"
    : location.pathname.startsWith("/todos")
      ? "To-Dos"
      : location.pathname.startsWith("/login") ||
          location.pathname.startsWith("/register")
        ? "Account"
        : "Jadara";

  const isTodos = location.pathname.startsWith("/todos");

  const linkClass = ({ isActive }) =>
    `nav-link ${
      isActive
        ? "bg-white/15 text-white"
        : "text-white/70 hover:bg-white/5 hover:text-white"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `flex h-11 items-center rounded-pill px-4 text-[17px] transition-colors duration-150 ease-apple ${
      isActive ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/5"
    }`;

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-surface-black text-white">
        <nav className="mx-auto flex h-11 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex shrink-0 items-center gap-2"
              onClick={() => setMobileOpen(false)}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-canvas text-[15px] font-bold text-ink">
                J
              </span>
              <span className="text-[17px] font-semibold tracking-[-0.01em]">
                Jadara
              </span>
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              <NavLink to="/" end className={linkClass}>
                Home
              </NavLink>
              {user && (
                <NavLink to="/todos" className={linkClass}>
                  My To-Dos
                </NavLink>
              )}
              {user?.role === "admin" && (
                <NavLink to="/admin" className={linkClass}>
                  Admin
                </NavLink>
              )}
            </div>
          </div>

          <div className="hidden items-center gap-2.5 md:flex">
            {user ? (
              <>
                <span className="badge bg-white/10 px-3 py-1.5 text-white/80">
                  {user.name}
                </span>
                <button onClick={handleLogout} className="btn btn-dark">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-dark">
                  Log in
                </Link>
                <Link to="/register" className="btn btn-primary !py-2 text-[14px]">
                  Sign up
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </nav>

        {mobileOpen && (
          <div className="animate-scale-in border-t border-white/10 md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
              <NavLink to="/" end className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
                Home
              </NavLink>
              {user && (
                <NavLink
                  to="/todos"
                  className={mobileLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  My To-Dos
                </NavLink>
              )}
              {user?.role === "admin" && (
                <NavLink
                  to="/admin"
                  className={mobileLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  Admin Dashboard
                </NavLink>
              )}

              <div className="mt-3 border-t border-white/10 pt-4">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <span className="badge bg-white/10 px-3 py-1.5 text-white/80">
                      {user.name} · {user.role}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="btn btn-dark justify-center"
                    >
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      to="/login"
                      className="btn btn-dark flex-1 justify-center"
                      onClick={() => setMobileOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      className="btn btn-primary flex-1 justify-center"
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-canvas-parchment/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-[52px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <p className="text-[21px] font-semibold tracking-[0.01em] text-ink">
            {section}
          </p>
          {user && isTodos ? (
            <Link to="/todos#new-task" className="btn btn-primary !py-2 text-[14px]">
              <PlusIcon className="h-4 w-4" />
              New task
            </Link>
          ) : user ? (
            <Link to="/todos" className="btn btn-primary !py-2 text-[14px]">
              My to-dos
            </Link>
          ) : (
            <Link to="/register" className="btn btn-primary !py-2 text-[14px]">
              Get started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}