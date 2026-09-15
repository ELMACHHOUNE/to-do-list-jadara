import { Link } from "react-router-dom";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "My To-Dos", to: "/todos" },
      { label: "Features", to: "/#features" },
      { label: "Admin Dashboard", to: "/admin" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", to: "/login" },
      { label: "Create account", to: "/register" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", to: null },
      { label: "Terms", to: null },
      { label: "Contact", to: null },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-canvas-parchment">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink text-[15px] font-bold text-canvas">
                J
              </span>
              <span className="text-[17px] font-semibold tracking-[-0.01em] text-ink">
                Jadara
              </span>
            </div>
            <p className="mt-4 max-w-[240px] text-[14px] leading-[1.6] text-ink-muted-48">
              A simple, fast and secure to-do list app. Stay organized, get
              things done.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[13px] font-semibold tracking-[-0.2px] text-ink">
                {col.title}
              </h4>
              <ul className="mt-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="text-[15px] leading-[2.41] text-ink-muted-48 transition-colors duration-150 ease-apple hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <span className="text-[15px] leading-[2.41] text-ink-muted-48">
                        {link.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-divider-soft pt-6">
          <p className="text-[12px] text-ink-muted-48">
            © {year} Jadara. All rights reserved.
          </p>
          <p className="mt-1 text-[10px] leading-[1.3] text-ink-muted-48">
            Built for people who get things done.
          </p>
        </div>
      </div>
    </footer>
  );
}