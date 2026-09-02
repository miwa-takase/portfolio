import { Link } from "react-router-dom";
import { SKILLS } from "../data/skills";

export default function Stack() {
  return (
    <section className="wrap py-16">
      <nav className="breadcrumb flex items-center gap-2 text-xs tracking-wide text-muted">
        <Link to="/" className="text-paper-dim hover:text-accent-soft">
          Home
        </Link>
        <span className="text-line">/</span>
        <span className="text-paper-dim">Stack</span>
      </nav>

      <header className="pt-10">
        <div className="text-xs uppercase tracking-widest text-accent">
          Stack
        </div>
        <h1 className="display-title mt-2 font-serif text-4xl font-medium leading-tight md:text-6xl">
          Technology Stack
        </h1>
      </header>

      <div className="mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
        {SKILLS.map((skill) => (
          <section key={skill.h}>
            <h2 className="mb-4 text-xs tracking-widest text-muted">
              {skill.h}
            </h2>
            <div className="utility-frame flex min-h-24 flex-wrap content-start gap-2">
              {skill.items.map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-line-soft bg-ink-2 px-2 py-1 text-xs text-paper-dim"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
