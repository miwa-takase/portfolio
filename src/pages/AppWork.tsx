import { Fragment, useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import MediaSlider from "../components/MediaSlider";
import { APPS_BY_ID, appSlides, overviewLines, publicUrl } from "../data/apps";
// import { canTryApp } from "../data/apps";
// import { FEATURES, type Feature } from "../data/features";

const btnGhost =
  "inline-flex items-center gap-2 rounded-full border border-line px-5 py-2 text-sm tracking-wide text-paper transition-all hover:border-accent hover:text-accent-soft";
// const btnPrimary =
//   "inline-flex items-center gap-2 rounded-full border border-accent bg-transparent px-5 py-2 text-sm font-semibold tracking-wide text-accent transition-colors hover:border-accent-soft hover:text-accent-soft";

// function appFeatures(appId: string): Feature[] {
//   return FEATURES.filter((feature) => feature.apps.includes(appId));
// }

export default function AppWork() {
  const { appId } = useParams();
  const app = appId ? APPS_BY_ID[appId] : undefined;
  const [slideIndex, setSlideIndex] = useState(0);
  const handleSlideChange = useCallback((i: number) => setSlideIndex(i), []);

  useEffect(() => {
    if (app) document.title = `${app.title} — Judy`;
  }, [app]);

  if (!app) {
    return (
      <section className="wrap py-20">
        <p className="text-paper-dim">アプリが見つかりません</p>
        <Link className={`${btnGhost} mt-4`} to="/works">
          ← Worksへ
        </Link>
      </section>
    );
  }

  // 「コア機能の概要をつかむ」ボタンのクローズに合わせて休止中
  // const features = appFeatures(app.id);
  // const primaryFeature = features[0];
  // const canTry = canTryApp(app);
  const slides = appSlides(app);
  const liveUrl = publicUrl(app);

  return (
    <section className="wrap md:pb-8 md:pt-4">
      <Breadcrumb
        items={[{ label: "Works", to: "/works" }, { label: app.title }]}
        className="pt-8"
      />

      <header className="pt-6">
        <h1 className="app-work-title font-serif text-4xl font-medium italic leading-tight md:text-5xl lg:text-6xl">
          {app.title}
          {app.wip && (
            <span className="ml-3 inline-flex rounded-md border border-line-soft px-2 py-0.5 align-middle font-sans text-sm leading-5 tracking-wide text-muted">
              WIP
            </span>
          )}
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-6 py-8 lg:grid-cols-2">
        {/* pt はメディアパネルの見出し（py-4）と行の高さを揃える */}
        <section className="app-work-panel card-surface rounded-xl px-6 pb-6 pt-4">
          <div className="text-sm uppercase tracking-widest text-muted">
            Overview
          </div>
          <p className="mt-2 text-base leading-8 text-paper-dim">
            {overviewLines(app).map((line, i) => (
              <Fragment key={line}>
                {i > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {app.tech.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-line-soft bg-ink-2 px-2 py-1 text-sm text-paper-dim"
              >
                {tech}
              </span>
            ))}
          </div>

          {liveUrl && (
            <div className="mt-4">
              <div className="mb-2 text-sm uppercase tracking-widest text-muted">
                URL
              </div>
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 break-all text-sm text-accent transition-colors hover:text-accent-soft"
              >
                {liveUrl}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          )}

          {/* 機能ページの精度が不十分なため一旦クローズ（スクショで代替）
          <div className="mt-8">
            {primaryFeature && canTry ? (
              <Link
                className={btnPrimary}
                to={`/works/${app.id}/${primaryFeature.slug}`}
              >
                コア機能の概要をつかむ
                <span aria-hidden="true">→</span>
              </Link>
            ) : (
              <span className="inline-flex rounded-full border border-line px-5 py-2 text-sm tracking-wide text-muted">
                {app.wip ? "WIP - 機能準備中" : "準備中"}
              </span>
            )}
          </div>
          */}
        </section>

        <section className="app-work-panel app-work-media overflow-hidden rounded-xl border border-line bg-ink-2">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="text-sm uppercase tracking-widest text-muted">
              Media
            </div>
            <div className="text-sm tracking-widest text-muted">
              {slides.length
                ? `${Math.min(slideIndex + 1, slides.length)} / ${slides.length}`
                : "WIP"}
            </div>
          </div>
          {slides.length ? (
            <MediaSlider
              key={app.id}
              slides={slides}
              fallbackAlt={app.media?.alt ?? `${app.title} の画面`}
              onIndexChange={handleSlideChange}
            />
          ) : (
            <div className="aspect-video bg-ink p-5">
              <div className="h-full w-full rounded-lg border border-dashed border-line-soft bg-panel/60" />
            </div>
          )}
        </section>
      </div>

      <nav className="flex justify-center border-t border-line-soft pb-2 pt-7">
        <Link className={btnGhost} to="/works">
          ← アプリ一覧へ
        </Link>
      </nav>
      <div className="h-8" />
    </section>
  );
}
