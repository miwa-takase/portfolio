import type { CSSProperties } from "react";
import Breadcrumb from "../components/Breadcrumb";
import TrackCard from "../components/TrackCard";
import { OWNER } from "../data/apps";
import { TIMELINE } from "../data/timeline";

export default function About() {
  return (
    <section className="wrap md:pb-8 md:pt-4">
      <Breadcrumb items={[{ label: "About" }]} className="pt-8" />

      <h1 className="display-title pt-6 font-serif text-4xl font-medium italic leading-tight md:text-5xl lg:text-6xl">
        {OWNER.name}
      </h1>

      <div className="py-4">
        <p className="text-paper-dim">
          AI・音声・映像を軸に、フロント・バックエンド・クラウド・AI連携まで、ひとりで組み上げます
        </p>

        <section className="about-column mt-8">
          <h2 className="mb-5 font-serif text-2xl font-medium">Why “Judy” ?</h2>
          <div className="rounded-2xl border border-white/70 p-6 sm:p-8">
            <div className="grid items-center gap-6 md:grid-cols-2">
              <p className="text-base leading-8 text-paper-dim">
                SMEに入社した際「散歩が趣味」と部署の先輩に話したところ、JUDY
                AND MARY の「散歩道」に ちなんで{" "}
                <span className="text-paper">Judy</span> と名付けてもらいました
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
      </div>
    </section>
  );
}
