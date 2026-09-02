import type { CSSProperties } from "react";
import Breadcrumb from "../components/Breadcrumb";
import TrackCard from "../components/TrackCard";
import { OWNER } from "../data/apps";
import { TIMELINE } from "../data/timeline";

export default function About() {
  return (
    <section className="about-page wrap">
      <Breadcrumb items={[{ label: "About" }]} className="pt-8" />

      <h1 className="display-title pt-6 font-serif text-4xl font-medium italic leading-tight md:text-5xl lg:text-6xl">
        {OWNER.name}
      </h1>

      <div className="py-4">
        <p className="mt-4 max-w-3xl text-base text-paper-dim">{OWNER.role}</p>
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
            <h2 className="mb-5 font-serif text-2xl font-medium">Timeline</h2>
            <div className="rounded-2xl border border-white/70 p-6 sm:p-8">
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
                      <div className="mt-1 text-lg text-paper">{t.title}</div>
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

        <section className="about-column mt-12">
          <h2 className="mb-5 font-serif text-2xl font-medium">Why “Judy” ?</h2>
          <div className="rounded-2xl border border-white/70 p-6 sm:p-8">
            <div className="grid items-center gap-6 md:grid-cols-2">
              <p className="text-base leading-8 text-paper-dim">
                「散歩が好き」と部署の先輩に話したところ、JUDY AND MARY
                の「散歩道」に かけて <span className="text-paper">judy</span>{" "}
                と名付けられました
              </p>
              <a
                href="https://open.spotify.com/track/72DDgSntVmV2Epq3ihPXKO"
                target="_blank"
                rel="noreferrer"
                className="utility-frame block transition-colors hover:border-accent"
                aria-label="JUDY AND MARY「散歩道」を Spotify で開く"
              >
                <TrackCard
                  albumArt="https://i.scdn.co/image/ab67616d00001e021f0927ea9a6ca01511bdfb91"
                  title="散歩道"
                  artist="JUDY AND MARY"
                />
              </a>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
