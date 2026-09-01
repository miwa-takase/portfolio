import { Link } from "react-router-dom";
import { OWNER } from "../data/apps";

const btnPrimary =
  "inline-flex items-center gap-2 rounded-full border border-accent bg-accent px-[18px] py-2 text-sm font-semibold tracking-[0.05em] text-[#0b1a26] transition-all hover:bg-accent-soft";
const btnGhost =
  "inline-flex items-center gap-2 rounded-full border border-line px-[18px] py-2 text-sm tracking-[0.05em] text-paper transition-all hover:border-accent hover:text-accent-soft";

export default function Home() {
  return (
    <>
      <section className="wrap">
        <div className="pb-7 pt-16 md:pt-[84px]">
          <div>
            <div className="reveal mb-[22px] text-xs uppercase tracking-[0.42em] text-accent">
              Portfolio&nbsp;/&nbsp;Developer
            </div>
            <h1
              className="reveal font-serif text-[clamp(2.6rem,7vw,5rem)] font-medium leading-[1.04]"
              style={{ animationDelay: ".08s" }}
            >
              Miwa <span className="italic text-accent-soft">Takase</span>
            </h1>
            <p
              className="reveal mt-[18px] max-w-[58ch] text-base text-paper-dim"
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
    </>
  );
}
