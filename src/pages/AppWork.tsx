import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import { APPS_BY_ID, canTryApp, publicUrl } from "../data/apps";
import { FEATURES, statusShort, type Feature } from "../data/features";

const btnGhost =
  "inline-flex items-center gap-2 rounded-full border border-line px-5 py-2 text-sm tracking-wide text-paper transition-all hover:border-accent hover:text-accent-soft";
const btnPrimary =
  "inline-flex items-center gap-2 rounded-full border border-accent bg-transparent px-5 py-2 text-sm font-semibold tracking-wide text-accent transition-colors hover:border-accent-soft hover:text-accent-soft";

function appFeatures(appId: string): Feature[] {
  return FEATURES.filter((feature) => feature.apps.includes(appId));
}

export default function AppWork() {
  const { appId } = useParams();
  const app = appId ? APPS_BY_ID[appId] : undefined;

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

  const features = appFeatures(app.id);
  const primaryFeature = features[0];
  const mediaSrc = app.media?.screenshot ?? app.media?.capture;
  const canTry = canTryApp(app);
  const liveUrl = publicUrl(app);

  return (
    <section className="wrap">
      <Breadcrumb
        items={[{ label: "Works", to: "/works" }, { label: app.title }]}
        className="pt-8"
      />

      <header className="pt-6">
        <h1 className="app-work-title font-serif text-4xl font-medium italic leading-tight md:text-5xl lg:text-6xl">
          {app.title}
          {app.wip && (
            <span className="tex-sm ml-3 inline-flex rounded-md border border-line-soft px-2 py-0.5 align-middle font-sans leading-5 tracking-wide text-muted">
              WIP
            </span>
          )}
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-6 py-8 lg:grid-cols-2">
        <section className="app-work-panel card-surface rounded-xl p-6">
          <div className="tex-sm uppercase tracking-widest text-muted">
            Overview
          </div>
          <p className="mt-2 text-base leading-8 text-paper-dim">
            {app.overview ?? "概要文が未入力です"}
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

          <div className="mt-4">
            <div className="tex-sm mb-2 uppercase tracking-widest text-muted">
              Sample Flow
            </div>
            {features.length ? (
              <div className="flex flex-wrap gap-2">
                {features.map((feature) => (
                  <span
                    key={feature.slug}
                    className="rounded-md border border-line-soft px-2 py-1 text-sm text-white"
                  >
                    {feature.title} · {statusShort(feature.status)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">機能サンプル準備中</p>
            )}
          </div>

          {liveUrl && (
            <div className="mt-4">
              <div className="tex-sm mb-2 uppercase tracking-widest text-muted">
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
        </section>

        <section className="app-work-panel app-work-media overflow-hidden rounded-xl border border-line bg-ink-2">
          <div className="flex items-center justify-between border-b border-line-soft px-5 py-4">
            <div className="text-sm uppercase tracking-widest text-muted">
              Screenshot / Capture
            </div>
            <div className="text-sm tracking-widest text-muted">
              {!mediaSrc && "WIP"}
            </div>
          </div>
          <div className="aspect-video bg-ink">
            {mediaSrc ? (
              <img
                src={mediaSrc}
                alt={app.media?.alt ?? `${app.title} の画面`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full grid-cols-5 gap-3 p-5">
                <span className="col-span-3 rounded-lg border border-dashed border-line-soft bg-panel/60" />
                <div className="col-span-2 grid gap-3">
                  <span className="rounded-lg border border-dashed border-line-soft bg-panel/60" />
                  <span className="rounded-lg border border-dashed border-line-soft bg-panel/60" />
                </div>
              </div>
            )}
          </div>
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
