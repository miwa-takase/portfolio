import { Link } from "react-router-dom";
import { OWNER } from "../data/apps";
import { TIMELINE } from "../data/timeline";
import { SKILLS } from "../data/skills";

export default function About() {
  return (
    <section className="wrap">
      <nav className="flex items-center gap-2 pt-8 text-xs tracking-wide text-muted">
        <Link to="/" className="text-paper-dim hover:text-accent-soft">
          Home
        </Link>
        <span className="text-line">/</span>
        <span className="text-paper-dim">About</span>
      </nav>

      <header className="pt-6">
        <div className="text-xs uppercase tracking-widest text-accent">
          About
        </div>
        <h1 className="mt-2 font-serif text-4xl font-medium leading-tight md:text-5xl lg:text-6xl">
          {OWNER.name}
        </h1>
        <p className="mt-4 max-w-3xl text-base text-paper-dim">{OWNER.role}</p>
      </header>

      <div className="py-8">
        <p className="mb-4 text-paper-dim">
          動画の文字起こし・多言語字幕、自然言語からのUI生成、配信リンクの集約と計測、
          エピソード生成——個人で試してきたプロダクトから、
          <b className="text-paper">「どんな機能を作ってきたか」</b>
          を機能軸で整理し、 その多くを
          <b className="text-paper">サイト上で実際に試せる</b>
          ようにしています
        </p>
        <p className="mb-4 text-paper-dim">
          フロントからバックエンド、クラウド、AI連携まで、一通りを一人で組み上げます
        </p>

        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-5">
          {/* 左：年表プロフィール（内容は src/data/timeline.ts を編集） */}
          <div className="md:col-span-3">
            <h2 className="mb-5 font-serif text-2xl font-medium">年表</h2>
            <ol className="relative ml-1">
              {TIMELINE.map((t, i) => {
                const line = i === 0 ? "top-6 bottom-0" : "top-0 bottom-0";
                return (
                  <li key={i} className="relative py-3 pl-7">
                    <span className={`absolute left-0 w-px bg-line ${line}`} />
                    <span className="absolute -left-1.5 top-4 h-3 w-3 rounded-full border-2 border-ink bg-accent" />
                    <div className="font-serif tracking-wide text-accent-soft">
                      {t.year}
                    </div>
                    <div className="mt-1 font-serif text-lg text-paper">
                      {t.title}
                    </div>
                    {t.detail && (
                      <p className="mt-1 text-paper-dim">{t.detail}</p>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>

          {/* 右：技術スタック */}
          <aside className="md:col-span-2">
            <h2 className="mb-4 mt-2 font-serif text-2xl font-medium">
              技術スタック
            </h2>
            <div className="grid gap-3">
              {SKILLS.map((s) => (
                <div key={s.h} className="card-surface rounded-xl p-5">
                  <h4 className="mb-2 font-serif text-base font-medium">
                    {s.h}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {s.items.map((i) => (
                      <span
                        key={i}
                        className="rounded-md border border-line-soft bg-ink-2 px-2 py-1 text-xs text-paper-dim"
                      >
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
