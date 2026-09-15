import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Reveal from "./Reveal";
import { CheckIcon, PlusIcon, SearchIcon } from "./Icons";

const DEMO_SEED = [
  { id: 1, title: "Plan the week ahead", done: true },
  { id: 2, title: "Ship the landing page", done: true },
  { id: 3, title: "Review that pull request", done: false },
  { id: 4, title: "Write release notes", done: false },
];

function DemoPreview() {
  const [items, setItems] = useState(DEMO_SEED);
  const done = items.filter((i) => i.done).length;
  const pct = Math.round((done / items.length) * 100);

  const toggle = (id) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i))
    );

  return (
    <div className="relative mx-auto mt-14 w-full max-w-md sm:mt-16">
      <button
        type="button"
        className="absolute -left-4 top-10 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-ink shadow-product backdrop-blur transition-transform duration-150 ease-apple hover:scale-105 active:scale-95 sm:-left-8 animate-float-y"
        aria-label="Add task (demo)"
      >
        <PlusIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        className="absolute -right-4 top-24 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-primary shadow-product backdrop-blur transition-transform duration-150 ease-apple hover:scale-105 active:scale-95 sm:-right-8 animate-float-y [animation-delay:1.5s]"
        aria-label="Completed (demo)"
      >
        <CheckIcon className="h-5 w-5" strokeWidth={2.5} />
      </button>

      <div className="animate-rise rounded-lg bg-surface-tile-1 p-6 text-left shadow-product sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[13px] font-medium text-canvas/90">Today</p>
            <p className="text-[12px] text-body-muted">
              {done} of {items.length} completed
            </p>
          </div>
          <div className="flex h-2 w-24 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700 ease-apple"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="space-y-2.5">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggle(item.id)}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors duration-200 ease-apple ${
                item.done ? "opacity-60" : ""
              } hover:bg-white/5`}
            >
              <span
                className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[7px] border transition-all duration-200 ease-apple ${
                  item.done
                    ? "border-primary bg-primary text-white"
                    : "border-white/25 text-transparent"
                }`}
              >
                {item.done && <CheckIcon className="h-3 w-3 animate-pop" />}
              </span>
              <span
                className={`flex-1 text-[15px] transition-colors duration-200 ${
                  item.done
                    ? "text-body-muted line-through"
                    : "text-canvas"
                }`}
              >
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const { user } = useAuth();

  return (
    <div className="bg-canvas-parchment">
      {/* ---- Light hero tile ---- */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-7xl px-4 pt-20 pb-0 text-center sm:px-6 lg:px-8 lg:pt-24">
          <Reveal>
            <p className="text-[14px] font-semibold tracking-[0.01em] text-primary">
              Task management, reimagined
            </p>

            <h1 className="mx-auto mt-4 max-w-3xl text-[40px] font-display font-semibold leading-[1.07] tracking-[-0.028em] text-ink sm:text-[52px] lg:text-[56px]">
              Your to-do list,{" "}
              <span className="text-primary">beautifully simple.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-[19px] font-normal leading-[1.4] tracking-[0.01em] text-ink-muted-80 sm:text-[22px]">
              Jadara keeps your tasks organized so you can focus on what
              matters — getting things done.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              {user ? (
                <Link to="/todos" className="btn btn-primary">
                  Go to my to-dos
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary">
                    Get started — it&rsquo;s free
                  </Link>
                  <a href="#features" className="btn btn-secondary">
                    Learn more
                  </a>
                </>
              )}
            </div>

            <p className="mt-5 text-[13px] text-ink-muted-48">
              Free forever. No credit card required.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <DemoPreview />
          </Reveal>
        </div>
      </section>

      {/* ---- Dark product tile ---- */}
      <section id="features" className="bg-surface-tile-1">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-24">
          <Reveal>
            <p className="text-[14px] font-semibold tracking-[0.01em] text-primary-on-dark">
              Why Jadara
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl text-[32px] font-display font-semibold leading-[1.1] tracking-[-0.02em] text-white sm:text-[40px]">
              Built for getting things done.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[20px] font-light leading-[1.5] text-body-muted sm:text-[24px]">
              Simple by design. Powerful enough to keep every part of your day
              moving forward.
            </p>
          </Reveal>

          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 text-left sm:grid-cols-3">
            {[
              {
                title: "Create & manage",
                copy: "Add tasks with titles and descriptions. Edit anything, anytime.",
              },
              {
                title: "Track progress",
                copy: "Mark things done and watch your undone list shrink one step at a time.",
              },
              {
                title: "Admin control",
                copy: "Admins manage every account while each user keeps a private space.",
              },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 120}>
                <div className="h-full rounded-lg border border-white/10 bg-white/5 p-7 transition-colors duration-300 ease-apple hover:bg-white/10">
                  <p className="text-[13px] font-semibold tracking-[0.05em] text-primary-on-dark">
                    0{i + 1}
                  </p>
                  <h3 className="mt-3 text-[21px] font-semibold leading-[1.19] tracking-[0.02em] text-white">
                    {f.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-[1.6] text-body-muted">
                    {f.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Light utility tile ---- */}
      <section id="how-it-works" className="bg-canvas">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-24">
          <Reveal>
            <h2 className="text-[32px] font-display font-semibold leading-[1.1] tracking-[-0.02em] text-ink sm:text-[40px]">
              Everything at a glance.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[19px] leading-[1.45] text-ink-muted-80">
              Search, filter and manage your day without breaking focus.
            </p>
          </Reveal>

          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                label: "01",
                title: "Search instantly",
                copy: "Find any task in a keystroke with instant search.",
              },
              {
                label: "02",
                title: "Filter your focus",
                copy: "Switch between All, Active and Completed views.",
              },
              {
                label: "03",
                title: "Watch progress",
                copy: "A live progress ring shows how far you've come.",
              },
            ].map((s, i) => (
              <Reveal key={s.title} delay={i * 120}>
                <div className="cursor-default rounded-lg border border-hairline p-8 transition-transform duration-300 ease-apple hover:-translate-y-1">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {i === 0 ? (
                      <SearchIcon className="h-5 w-5" />
                    ) : i === 1 ? (
                      <PlusIcon className="h-5 w-5" />
                    ) : (
                      <CheckIcon className="h-5 w-5" strokeWidth={2.5} />
                    )}
                  </span>
                  <p className="mt-5 text-[13px] font-semibold tracking-[0.05em] text-ink-muted-48">
                    {s.label}
                  </p>
                  <h3 className="mt-2 text-[21px] font-semibold tracking-[0.02em] text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-[1.55] text-ink-muted-48">
                    {s.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}