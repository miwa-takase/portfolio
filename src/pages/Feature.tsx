import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FEATURES, FEATURES_BY_SLUG } from "../data/features";
import type { DemoType } from "../data/features";
import { APPS_BY_ID, canTryApp } from "../data/apps";
import Badge from "../components/Badge";
import Breadcrumb from "../components/Breadcrumb";
import Demo from "../demos/Demo";

function demoLabel(t: DemoType): string {
  return t === "live"
    ? "実バックエンド接続 / サンプル"
    : t === "widget"
      ? "ブラウザ内デモ"
      : t === "diagram"
        ? "仕組みの図解"
        : "録画・サンプル";
}

const btnGhost =
  "inline-flex items-center gap-2 rounded-full border border-line px-5 py-2 text-sm tracking-wide text-paper transition-all hover:border-accent hover:text-accent-soft";

export default function Feature() {
  const { appId, slug } = useParams();
  const f = slug ? FEATURES_BY_SLUG[slug] : undefined;
  const app = appId ? APPS_BY_ID[appId] : undefined;

  useEffect(() => {
    if (f) document.title = `${f.title} — Judy`;
  }, [f]);

  if (!f || !app || !f.apps.includes(app.id)) {
    return (
      <section className="wrap py-20">
        <p className="text-paper-dim">機能が見つかりません</p>
        <Link className={`${btnGhost} mt-4`} to="/works">
          ← Worksへ
        </Link>
      </section>
    );
  }

  const relatedFeatures = FEATURES.filter((feature) =>
    feature.apps.includes(app.id),
  );
  const idx = relatedFeatures.findIndex((x) => x.slug === f.slug);
  const prev =
    relatedFeatures[
      (idx - 1 + relatedFeatures.length) % relatedFeatures.length
    ];
  const next = relatedFeatures[(idx + 1) % relatedFeatures.length];
  const apps = f.apps.map((id) => APPS_BY_ID[id]).filter(Boolean);
  const canTry = canTryApp(app);

  return (
    <section className="wrap">
      <Breadcrumb
        items={[
          { label: "Works", to: "/works" },
          { label: app.title, to: `/works/${app.id}` },
          { label: f.title },
        ]}
        className="pt-8"
      />

      <header className="feature-header pb-8 pt-5">
        <h1 className="feature-title font-serif text-4xl font-medium italic leading-tight md:text-5xl lg:text-6xl">
          {f.title}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-paper-dim">{f.tagline}</p>
        <div className="mt-5 flex items-center gap-4">
          <Badge status={f.status} />
          <span className="text-sm text-muted">{demoLabel(f.demo.type)}</span>
        </div>
      </header>

      <div className="feature-demo-panel overflow-hidden rounded-2xl border border-line bg-ink-2">
        <div className="flex items-center justify-between gap-3 border-b border-line-soft bg-gradient-to-b from-panel-2 to-panel px-5 py-4">
          <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-accent">
            ◍ {canTry ? "試せる場" : "準備中"}
          </div>
          <div className="text-sm tracking-widest text-muted">
            {canTry ? demoLabel(f.demo.type) : "WIP"}
          </div>
        </div>
        <div className="px-5 py-5">
          {canTry ? (
            <Demo feature={f} />
          ) : (
            <p className="text-sm text-paper-dim">
              このアプリは WIP のため、機能サンプルはまだ公開していません
            </p>
          )}
        </div>
        {canTry && f.demo.note && (
          <div className="px-5 pb-4 text-sm text-muted">※ {f.demo.note}</div>
        )}
      </div>

      <div className="grid grid-cols-1 items-start gap-6 py-5 md:grid-cols-3 md:gap-10">
        <div className="md:col-span-2">
          <p className="mb-4 text-paper-dim">{f.summary}</p>
          <h3 className="mb-3 mt-6 font-serif text-xl font-medium">
            できること
          </h3>
          <ul className="grid gap-2">
            {f.capabilities.map((c) => (
              <li key={c} className="relative pl-6 text-base text-paper">
                <span className="absolute left-0 text-paper">-</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
        <aside className="feature-tech-panel card-surface sticky top-24 rounded-xl p-5">
          <h4 className="mb-3 text-sm uppercase tracking-widest text-muted">
            使用技術
          </h4>
          <div className="mb-5 flex flex-wrap gap-2">
            {f.tech.map((t) => (
              <span
                key={t}
                className="rounded-md border border-line-soft bg-ink-2 px-2 py-1 text-sm text-paper-dim"
              >
                {t}
              </span>
            ))}
          </div>
          <h4 className="mb-3 text-sm uppercase tracking-widest text-muted">
            この機能を実装したアプリ
          </h4>
          {apps.length ? (
            apps.map((p, i) => (
              <Link
                key={p.id}
                to={`/works/${p.id}`}
                className={`py-2 ${i === 0 ? "" : "border-t border-line-soft"}`}
              >
                <b className="block font-serif text-base font-medium">
                  {p.title}
                </b>
                <small className="text-sm text-muted">
                  {p.tech.slice(0, 3).join(" · ")}
                </small>
              </Link>
            ))
          ) : (
            <small className="text-muted">—</small>
          )}
        </aside>
      </div>

      <nav className="flex flex-wrap justify-between gap-4 border-t border-line-soft pb-2 pt-7">
        {relatedFeatures.length > 1 ? (
          <Link className={btnGhost} to={`/works/${app.id}/${prev.slug}`}>
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        <Link className={btnGhost} to={`/works/${app.id}`}>
          ← アプリ詳細へ
        </Link>
        {relatedFeatures.length > 1 ? (
          <Link className={btnGhost} to={`/works/${app.id}/${next.slug}`}>
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
      <div className="h-8" />
    </section>
  );
}
