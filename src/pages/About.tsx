import { Link } from "react-router-dom";
import { OWNER } from "../data/apps";
import { TIMELINE } from "../data/timeline";

const btnGhost =
  "inline-flex items-center gap-2 rounded-full border border-line px-[18px] py-2.5 text-[0.82rem] tracking-[0.05em] text-paper transition-all hover:border-accent hover:text-accent-soft";

export default function About() {
  return (
    <section className="wrap">
      <nav className="flex items-center gap-2.5 pt-[30px] text-[0.76rem] tracking-[0.06em] text-muted">
        <Link to="/" className="text-paper-dim hover:text-accent-soft">
          Home
        </Link>
        <span className="text-line">/</span>
        <span className="text-paper-dim">About</span>
      </nav>

      <header className="pt-[22px]">
        <div className="text-[0.74rem] uppercase tracking-[0.34em] text-accent">
          About
        </div>
        <h1 className="mt-2.5 font-serif text-[clamp(2.2rem,6vw,3.6rem)] font-medium leading-[1.1]">
          {OWNER.name}
        </h1>
        <p className="mt-4 max-w-[60ch] text-[1.05rem] text-paper-dim">
          {OWNER.role}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 py-8 md:grid-cols-[1fr_300px] md:gap-12">
        <div>
          <p className="mb-4 text-paper-dim">
            動画の文字起こし・多言語字幕、自然言語からのUI生成、配信リンクの集約と計測、
            音楽サービス連携、エピソード生成——個人で試してきたプロダクトから、
            <b className="text-paper">「どんな機能を作ってきたか」</b>
            を機能軸で整理し、 その多くを
            <b className="text-paper">サイト上で実際に試せる</b>
            ようにしています
          </p>
          <p className="mb-4 text-paper-dim">
            フロントからバックエンド、クラウド、AI連携まで、一通りを一人で組み上げます。
            使用している技術スタックは Works（機能一覧）の冒頭にまとめています。
          </p>
          {/* 年表プロフィール（内容は src/data/timeline.ts を編集） */}
          <h2 className="mb-5 mt-10 font-serif text-[1.5rem] font-medium">
            年表
          </h2>
          <ol className="relative ml-1 border-l border-line">
            {TIMELINE.map((t, i) => (
              <li key={i} className="relative py-3 pl-7">
                <span className="absolute -left-[6.5px] top-[18px] h-3 w-3 rounded-full border-2 border-ink bg-accent" />
                <div className="font-serif text-[0.9rem] tracking-[0.08em] text-accent-soft">
                  {t.year}
                </div>
                <div className="mt-0.5 font-serif text-[1.08rem] text-paper">
                  {t.title}
                </div>
                {t.detail && (
                  <p className="mt-1 text-[0.9rem] text-paper-dim">
                    {t.detail}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>

        <aside className="card-surface h-max rounded-[14px] p-5">
          <h4 className="mb-3 text-[0.7rem] uppercase tracking-[0.2em] text-muted">
            Contact
          </h4>
          <a
            href={`mailto:${OWNER.email}`}
            className="break-all border-b border-line text-accent-soft transition-colors hover:border-accent"
          >
            {OWNER.email}
          </a>
          <div className="mt-6">
            <Link className={btnGhost} to="/works">
              機能を試す →
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
