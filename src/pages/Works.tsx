import { Link } from "react-router-dom";
import { APPS, type App } from "../data/apps";
import { FEATURES } from "../data/features";
import { SKILL_COUNT } from "../data/skills";

function AppWorkCard({ app }: { app: App }) {
  return (
    <Link
      to={`/works/${app.id}`}
      className="card-surface group relative flex min-h-64 flex-col overflow-hidden rounded-2xl px-6 pb-6 pt-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      <span className="absolute inset-y-0 left-0 w-1 bg-accent" />
      <h3 className="font-serif text-2xl font-medium">{app.title}</h3>
      <p className="mt-3 flex-grow text-paper-dim">
        {app.overview ??
          "概要文を後で追加。目的、主なユーザー体験、実装した範囲をここにまとめます。"}
        {app.wip && (
          <span className="ml-2 inline-flex rounded-md border border-line-soft px-2 py-0.5 align-middle text-xs leading-5 tracking-wide text-muted">
            WIP
          </span>
        )}
      </p>
      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs tracking-wide text-muted">詳細を見る</span>
        <span className="text-lg text-accent transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  );
}

export default function Works() {
  return (
    <section className="wrap">
      <nav className="flex items-center gap-2 pt-8 text-xs tracking-wide text-muted">
        <Link to="/" className="text-paper-dim hover:text-accent-soft">
          Home
        </Link>
        <span className="text-line">/</span>
        <span className="text-paper-dim">Works</span>
      </nav>

      <div className="mt-6 flex flex-wrap gap-8 border-y border-line-soft py-7">
        <div>
          <b className="block font-serif text-3xl text-paper">
            {FEATURES.length}
          </b>
          <span className="text-xs tracking-wide text-muted">機能カテゴリ</span>
        </div>
        <div>
          <b className="block font-serif text-3xl text-paper">{APPS.length}</b>
          <span className="text-xs tracking-wide text-muted">掲載アプリ</span>
        </div>
        <div>
          <b className="block font-serif text-3xl text-paper">{SKILL_COUNT}</b>
          <span className="text-xs tracking-wide text-muted">技術スタック</span>
        </div>
      </div>

      <div className="mt-10 pt-2">
        <div className="text-xs uppercase tracking-widest text-accent">
          Applications
        </div>
        <h2 className="mt-2 font-serif text-3xl font-medium">アプリ一覧</h2>
      </div>
      <p className="mt-4 max-w-2xl text-base text-paper-dim">
        このデバイス上の各アプリを起点に整理しました
        <br />
        カードから詳細へ進み、そこでスクリーンショット・キャプチャと機能サンプルを確認できます
      </p>

      <div className="flex items-center justify-end py-2 text-xs tracking-wide text-muted">
        {APPS.length} アプリ
      </div>

      <div className="grid grid-cols-1 gap-5 pb-10 sm:grid-cols-2 lg:grid-cols-3">
        {APPS.map((app) => (
          <AppWorkCard key={app.id} app={app} />
        ))}
      </div>
    </section>
  );
}
