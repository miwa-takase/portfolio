import { Link } from "react-router-dom";
import { APPS, type App } from "../data/apps";
import { FEATURES } from "../data/features";
import { SKILL_COUNT } from "../data/skills";

function AppWorkCard({ app }: { app: App }) {
  return (
    <Link
      to={`/works/${app.id}`}
      className="card-surface group relative flex min-h-[250px] flex-col overflow-hidden rounded-2xl px-6 pb-[22px] pt-[26px] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_26px_50px_-28px_rgba(0,0,0,0.85)]"
    >
      <span className="absolute inset-y-0 left-0 w-[3px] bg-accent" />
      {app.wip && (
        <div className="mb-4 flex justify-end">
          <span className="rounded-[5px] border border-line-soft px-2 py-1 text-[11px] tracking-[0.08em] text-muted">
            WIP
          </span>
        </div>
      )}
      <h3 className="font-serif text-2xl font-medium">{app.title}</h3>
      <p className="mt-3 flex-grow text-paper-dim">
        {app.overview ??
          "概要文を後で追加。目的、主なユーザー体験、実装した範囲をここにまとめます。"}
      </p>
      <div className="mt-[18px] flex items-center justify-between">
        <span className="text-xs tracking-[0.06em] text-muted">詳細を見る</span>
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
      <nav className="flex items-center gap-2 pt-[30px] text-xs tracking-[0.06em] text-muted">
        <Link to="/" className="text-paper-dim hover:text-accent-soft">
          Home
        </Link>
        <span className="text-line">/</span>
        <span className="text-paper-dim">Works</span>
      </nav>

      <div className="mt-6 flex flex-wrap gap-[34px] border-y border-line-soft py-[26px]">
        <div>
          <b className="block font-serif text-3xl text-paper">
            {FEATURES.length}
          </b>
          <span className="text-xs tracking-[0.08em] text-muted">
            機能カテゴリ
          </span>
        </div>
        <div>
          <b className="block font-serif text-3xl text-paper">{APPS.length}</b>
          <span className="text-xs tracking-[0.08em] text-muted">
            掲載アプリ
          </span>
        </div>
        <div>
          <b className="block font-serif text-3xl text-paper">{SKILL_COUNT}</b>
          <span className="text-xs tracking-[0.08em] text-muted">
            技術スタック
          </span>
        </div>
      </div>

      <div className="mt-10 pt-2">
        <div className="text-xs uppercase tracking-[0.34em] text-accent">
          Applications
        </div>
        <h2 className="mt-2 font-serif text-3xl font-medium">アプリ一覧</h2>
      </div>
      <p className="mt-4 max-w-[680px] text-base text-paper-dim">
        このデバイス上の各アプリを起点に整理しました
        <br />
        カードから詳細へ進み、そこでスクリーンショット・キャプチャと機能サンプルを確認できます
      </p>

      <div className="flex items-center justify-end py-2 text-xs tracking-[0.08em] text-muted">
        {APPS.length} アプリ
      </div>

      <div className="grid grid-cols-1 gap-[18px] pb-10 sm:grid-cols-2 lg:grid-cols-3">
        {APPS.map((app) => (
          <AppWorkCard key={app.id} app={app} />
        ))}
      </div>
    </section>
  );
}
