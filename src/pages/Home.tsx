import { Link } from "react-router-dom";
import { OWNER } from "../data/apps";

const btnPrimary =
  "inline-flex items-center gap-2 rounded-full border border-accent bg-accent px-5 py-2 text-sm font-semibold tracking-wide text-muted transition-all hover:bg-accent-soft";
const btnGhost =
  "inline-flex items-center gap-2 rounded-full border border-line px-5 py-2 text-sm tracking-wide text-paper transition-all hover:border-accent hover:text-accent-soft";

export default function Home() {
  return (
    <section className="wrap">
      <div className="pb-7 pt-16 md:pt-20 lg:pt-24">
        <div>
          <div className="reveal mb-6 text-xs uppercase tracking-widest text-accent">
            Portfolio&nbsp;/&nbsp;Developer
          </div>
          <h1
            className="reveal font-serif text-5xl font-medium leading-tight md:text-7xl lg:text-8xl"
            style={{ animationDelay: ".08s" }}
          >
            {OWNER.firstName}
            <span className="italic text-accent-soft">{OWNER.lastName}</span>
          </h1>
          <p
            className="reveal mt-5 max-w-2xl text-base text-paper-dim"
            style={{ animationDelay: ".18s" }}
          >
            {OWNER.role}
          </p>
          <div
            className="reveal mt-4 flex flex-wrap gap-2"
            style={{ animationDelay: ".28s" }}
          >
            <Link className={btnPrimary} to="/works">
              機能を試す →
            </Link>
            <Link className={btnGhost} to="/about">
              About
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
