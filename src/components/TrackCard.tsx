import type { ReactNode } from "react";

type TrackCardProps = {
  /** アルバムアートの画像URL：未指定なら ♪ プレースホルダを表示 */
  albumArt?: string;
  title: string;
  artist?: string;
  /** 曲名・アーティストの下に差し込む追加要素（再生プログレスなど） */
  children?: ReactNode;
};

// アルバムアート＋曲名＋アーティストの共通レイアウト
// （NOW PLAYING / Favorite Music / About の楽曲カードで共用）
export default function TrackCard({
  albumArt,
  title,
  artist,
  children,
}: TrackCardProps) {
  return (
    <div className="flex items-center gap-4">
      {albumArt ? (
        <img
          src={albumArt}
          alt=""
          loading="lazy"
          className="h-20 w-20 rounded-md border border-line-soft object-cover"
        />
      ) : (
        <div className="flex h-20 w-20 items-center justify-center rounded-md border border-line-soft text-2xl text-accent">
          ♪
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate font-serif text-lg italic text-paper">
          {title}
        </div>
        {artist && (
          <div className="truncate text-sm text-paper-dim">{artist}</div>
        )}
        {children}
      </div>
    </div>
  );
}
