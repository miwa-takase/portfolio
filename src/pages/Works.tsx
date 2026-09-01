import { Link } from "react-router-dom";
import { APPS } from "../data/apps";
import { FEATURES } from "../data/features";
import { SKILL_COUNT } from "../data/skills";
import FeatureCard from "../components/FeatureCard";

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
          Capabilities
        </div>
        <h2 className="mt-2 font-serif text-3xl font-medium">機能一覧</h2>
      </div>
      <p className="mt-4 max-w-[680px] text-base text-paper-dim">
        「どんな機能を作ってきたか」を軸に整理しました。各ページで実際に
        <b className="text-paper">試せます</b>——実バックエンドに繋がる
        <b className="text-teal">実デモ</b>、ブラウザ内の
        <b className="text-accent-soft">サンプル</b>まで。
      </p>

      <div className="flex items-center justify-end py-2 text-xs tracking-[0.08em] text-muted">
        {FEATURES.length} 機能
      </div>

      <div className="grid grid-cols-1 gap-[18px] pb-10 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <FeatureCard key={f.slug} feature={f} />
        ))}
      </div>
    </section>
  );
}
