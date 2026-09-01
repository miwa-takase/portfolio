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
  "inline-flex items-center gap-2 rounded-full border border-line px-[18px] py-2 text-sm tracking-[0.05em] text-paper transition-all hover:border-accent hover:text-accent-soft";
const btnPrimary =
  "inline-flex items-center gap-2 rounded-full border border-accent bg-accent px-[18px] py-2 text-sm font-semibold tracking-[0.05em] text-[#0b1a26] transition-colors hover:bg-accent-soft";

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
      <nav className="flex items-center gap-2 pt-[30px] text-xs tracking-[0.06em] text-muted">
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

      <header className="pb-[30px] pt-5">
        <h1 className="font-serif text-[clamp(2.1rem,6vw,3.6rem)] font-medium leading-[1.08]">
          {app.title}
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-6 pb-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="card-surface rounded-[14px] p-6">
          <div className="text-xs uppercase tracking-[0.2em] text-muted">
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
                className="rounded-[5px] border border-line-soft bg-ink-2 px-2 py-[3px] text-xs text-paper-dim"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <div className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">
              Sample Flow
            </div>
            {features.length ? (
              <div className="flex flex-wrap gap-2">
                {features.map((feature) => (
                  <span
                    key={feature.slug}
                    className={`rounded-[5px] border border-line-soft px-2 py-[3px] text-xs ${ACCENT_TEXT[feature.accent]}`}
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
              <Link className={btnPrimary} to={`/works/${primaryFeature.slug}`}>
                機能を試す
                <span aria-hidden="true">→</span>
              </Link>
            ) : (
              <span className="inline-flex rounded-full border border-line px-[18px] py-2 text-sm tracking-[0.05em] text-muted">
                準備中
              </span>
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-[14px] border border-line bg-ink-2">
          <div className="flex items-center justify-between border-b border-line-soft px-[18px] py-4">
            <div className="text-xs uppercase tracking-[0.2em] text-muted">
              Screenshot / Capture
            </div>
            <div className="text-xs tracking-[0.1em] text-muted">
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
              <div className="grid h-full grid-cols-[1.4fr_1fr] gap-3 p-5">
                <span className="rounded-[8px] border border-dashed border-line-soft bg-panel/60" />
                <div className="grid gap-3">
                  <span className="rounded-[8px] border border-dashed border-line-soft bg-panel/60" />
                  <span className="rounded-[8px] border border-dashed border-line-soft bg-panel/60" />
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <nav className="border-t border-line-soft pb-2 pt-[26px]">
        <Link className={btnGhost} to="/works">
          ← アプリ一覧へ
        </Link>
      </nav>
      <div className="h-[30px]" />
    </section>
  );
}
