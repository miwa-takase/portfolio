import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { OWNER } from "../data/apps";
import { TIMELINE } from "../data/timeline";

export default function About() {
  return (
    <section className="about-page wrap">
      <nav className="breadcrumb flex items-center gap-2 pt-8 text-xs tracking-wide text-muted">
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
        <h1 className="display-title mt-2 font-serif text-4xl font-medium italic leading-tight md:text-5xl lg:text-6xl">
          {OWNER.name}
        </h1>
        <p className="mt-4 max-w-3xl text-base text-paper-dim">{OWNER.role}</p>
      </header>

      <div className="py-4">
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

        <div className="about-timeline-wrap mt-8">
          <div className="about-timeline">
            <h2 className="mb-5 font-serif text-2xl font-medium">年表</h2>
            <ol
              className="about-timeline-list"
              style={
                {
                  "--timeline-count": TIMELINE.length,
                  "--timeline-start": `${50 / TIMELINE.length}%`,
                } as CSSProperties
              }
            >
              {TIMELINE.map((t, i) => (
                <li
                  key={i}
                  className={`about-timeline-item ${
                    i % 2 === 0
                      ? "about-timeline-item-top"
                      : "about-timeline-item-bottom"
                  }`}
                >
                  <span className="about-timeline-stem" aria-hidden="true" />
                  <span className="about-timeline-dot" aria-hidden="true" />
                  <div className="about-timeline-content">
                    <div className="font-serif tracking-wide text-white">
                      {t.year}
                    </div>
                    <div className="mt-1 font-serif text-lg text-paper">
                      {t.title}
                    </div>
                    {t.detail && (
                      <p className="mt-1 text-paper-dim">{t.detail}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
