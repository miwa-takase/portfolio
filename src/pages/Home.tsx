import { Link } from "react-router-dom";
import { OWNER } from "../data/apps";

const btnPrimary =
  "inline-flex items-center gap-2 rounded-full border border-accent bg-accent px-[18px] py-2.5 text-[0.82rem] font-semibold tracking-[0.05em] text-[#0b1a26] transition-all hover:bg-accent-soft";
const btnGhost =
  "inline-flex items-center gap-2 rounded-full border border-line px-[18px] py-2.5 text-[0.82rem] tracking-[0.05em] text-paper transition-all hover:border-accent hover:text-accent-soft";

export default function Home() {
  return (
    <>
      <section className="wrap">
        <div className="pb-7 pt-16 md:pt-[84px]">
          <div>
            <div className="reveal mb-[22px] text-[0.76rem] uppercase tracking-[0.42em] text-accent">
              Portfolio&nbsp;/&nbsp;Developer
            </div>
            <h1
              className="reveal font-serif text-[clamp(2.6rem,7vw,5rem)] font-medium leading-[1.04]"
              style={{ animationDelay: ".08s" }}
            >
              Miwa <span className="italic text-accent-soft">Takase</span>
            </h1>
            <p
              className="reveal mt-[18px] max-w-[34ch] text-[1.02rem] text-paper-dim"
              style={{ animationDelay: ".18s" }}
            >
              {OWNER.role}
            </p>
            <div
              className="reveal mt-3.5 flex flex-wrap gap-2.5"
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

      <section className="wrap pt-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line-soft pb-2.5 pt-[34px]">
          <p className="m-0 max-w-[680px] text-[1.02rem] text-paper-dim">
            実装してきた機能は、すべて Works 一覧から実際に試せます。
          </p>
          <Link className={btnPrimary} to="/works">
            機能一覧へ →
          </Link>
        </div>
      </section>
    </>
  );
}
