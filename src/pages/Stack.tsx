import Breadcrumb from "../components/Breadcrumb";
import { SKILLS } from "../data/skills";

export default function Stack() {
  return (
    <section className="wrap py-16">
      <Breadcrumb items={[{ label: "Stack" }]} />

      <h1 className="display-title pt-6 font-serif text-4xl font-medium italic leading-tight md:text-5xl lg:text-6xl">
        Technology Stack
      </h1>

      <div className="mt-10 grid gap-5">
        {SKILLS.map((skill) => (
          <section key={skill.h}>
            <h2 className="mb-4 text-sm tracking-widest text-muted">
              {skill.h}
            </h2>
            <div className="utility-frame flex min-h-24 flex-wrap content-start gap-2">
              {skill.items.map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-line-soft bg-ink-2 px-2 py-1 text-sm text-paper-dim"
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
