import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { APPS_BY_ID } from "../data/apps";
import {
  ACCENT_TEXT,
  FEATURES,
  statusShort,
  type Feature,
} from "../data/features";

const btnGhost =
  "inline-flex items-center gap-2 rounded-full border border-line px-5 py-2 text-sm tracking-wide text-paper transition-all hover:border-accent hover:text-accent-soft";
const btnPrimary =
  "inline-flex items-center gap-2 rounded-full border border-accent bg-accent px-5 py-2 text-sm font-semibold tracking-wide text-ink transition-colors hover:bg-accent-soft";

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

  return (
    <section className="wrap">
      <nav className="flex items-center gap-2 pt-8 text-xs tracking-wide text-muted">
        <Link to="/" className="text-paper-dim hover:text-accent-soft">
          Home
        </Link>
        <span className="text-line">/</span>
        <Link to="/works" className="text-paper-dim hover:text-accent-soft">
          Works
        </Link>
        <span className="text-line">/</span>
        <span className="text-paper-dim">{app.title}</span>
      </nav>

      <header className="pb-8 pt-5">
        <h1 className="font-serif text-4xl font-medium leading-tight md:text-5xl lg:text-6xl">
          {app.title}
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-6 pb-8 lg:grid-cols-2">
        <section className="card-surface rounded-xl p-6">
          <div className="text-xs uppercase tracking-widest text-muted">
            Overview
          </div>
          <p className="mt-4 text-base leading-8 text-paper-dim">
            {app.overview ??
              "概要文を後で追加。目的、主なユーザー体験、実装した範囲をここにまとめます。"}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {app.tech.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-line-soft bg-ink-2 px-2 py-1 text-xs text-paper-dim"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <div className="mb-3 text-xs uppercase tracking-widest text-muted">
              Sample Flow
            </div>
            {features.length ? (
              <div className="flex flex-wrap gap-2">
                {features.map((feature) => (
                  <span
                    key={feature.slug}
                    className={`rounded-md border border-line-soft px-2 py-1 text-xs ${ACCENT_TEXT[feature.accent]}`}
                  >
                    {feature.title} · {statusShort(feature.status)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">機能サンプル準備中</p>
            )}
          </div>

          <div className="mt-8">
            {primaryFeature ? (
              <Link
                className={btnPrimary}
                to={`/works/${app.id}/${primaryFeature.slug}`}
              >
                機能を試す
                <span aria-hidden="true">→</span>
              </Link>
            ) : (
              <span className="inline-flex rounded-full border border-line px-5 py-2 text-sm tracking-wide text-muted">
                準備中
              </span>
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-line bg-ink-2">
          <div className="flex items-center justify-between border-b border-line-soft px-5 py-4">
            <div className="text-xs uppercase tracking-widest text-muted">
              Screenshot / Capture
            </div>
            <div className="text-xs tracking-widest text-muted">
              {mediaSrc ? "Attached" : "Pending"}
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

      <nav className="border-t border-line-soft pb-2 pt-7">
        <Link className={btnGhost} to="/works">
          ← アプリ一覧へ
        </Link>
      </nav>
      <div className="h-8" />
    </section>
  );
}
