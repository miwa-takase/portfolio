import { useEffect, useRef, useState } from "react";
import type { MediaSlide } from "../data/apps";

type MediaSliderProps = {
  slides: MediaSlide[];
  /** alt が未指定のスライドで使う代替テキスト */
  fallbackAlt: string;
  /** 表示中のスライド番号（0始まり）が変わったときに呼ばれる */
  onIndexChange?: (index: number) => void;
};

// Media パネル用スライダー
// 1スライド＝画像 / 動画 / 音声を1つずつ表示し、ドット・キー操作・スワイプで切り替える
export default function MediaSlider({
  slides,
  fallbackAlt,
  onIndexChange,
}: MediaSliderProps) {
  const [index, setIndex] = useState(0);
  const dragStartX = useRef<number | null>(null);
  const mediaRefs = useRef<(HTMLMediaElement | null)[]>([]);

  const total = slides.length;
  const multiple = total > 1;

  // スライド枚数が減ったときに範囲外を参照しないよう補正
  useEffect(() => {
    setIndex((i) => (i < total ? i : 0));
  }, [total]);

  useEffect(() => {
    onIndexChange?.(index);
  }, [index, onIndexChange]);

  // 表示から外れた動画・音声は再生を止める
  useEffect(() => {
    mediaRefs.current.forEach((media, i) => {
      if (media && i !== index) media.pause();
    });
  }, [index]);

  if (!total) return null;

  const go = (next: number) => setIndex(((next % total) + total) % total);

  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const start = dragStartX.current;
    dragStartX.current = null;
    if (start === null || !multiple) return;
    const delta = e.clientX - start;
    if (Math.abs(delta) < 40) return;
    go(index + (delta < 0 ? 1 : -1));
  };

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Media"
      tabIndex={0}
      // ドットの有無にかかわらずパネル下端との余白を保つ
      className="pb-4"
      onKeyDown={(e) => {
        if (!multiple) return;
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      {/* 枠線とくっつかないよう左右に少し余白を取る */}
      <div
        className="mx-4 aspect-video select-none overflow-hidden bg-ink"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={slide.src} className="h-full w-full shrink-0">
              {slide.type === "video" && (
                <video
                  ref={(el) => {
                    mediaRefs.current[i] = el;
                  }}
                  src={slide.src}
                  poster={slide.poster}
                  controls
                  playsInline
                  preload="metadata"
                  aria-label={slide.alt ?? fallbackAlt}
                  className="h-full w-full bg-ink object-contain"
                />
              )}

              {/* 音声は poster があれば背景に敷き、プレーヤーを中央に置く */}
              {slide.type === "audio" && (
                <div className="relative flex h-full w-full items-center justify-center bg-ink">
                  {slide.poster && (
                    <img
                      src={slide.poster}
                      alt=""
                      loading={i === 0 ? "eager" : "lazy"}
                      draggable={false}
                      className="absolute inset-0 h-full w-full object-cover opacity-40"
                    />
                  )}
                  <div className="relative flex w-full max-w-lg flex-col items-center gap-4 px-6">
                    {slide.label && (
                      <p className="text-center text-sm leading-7 text-paper">
                        {slide.label}
                      </p>
                    )}
                    {/* デザイン切替で背景が透明になってもプレーヤーが埋もれないよう下地を敷く */}
                    <div
                      className="w-full rounded-full border border-line-soft p-2"
                      style={{ background: "rgba(12, 12, 14, 0.45)" }}
                    >
                      <audio
                        ref={(el) => {
                          mediaRefs.current[i] = el;
                        }}
                        src={slide.src}
                        controls
                        preload="metadata"
                        aria-label={slide.alt ?? slide.label ?? fallbackAlt}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}

              {slide.type === "image" && (
                <img
                  src={slide.src}
                  alt={slide.alt ?? fallbackAlt}
                  loading={i === 0 ? "eager" : "lazy"}
                  draggable={false}
                  className="h-full w-full object-contain"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 動画のネイティブコントロールと重ならないよう、ドットはフレームの外に置く */}
      {multiple && (
        <div className="flex items-center justify-center px-5 pt-4">
          <div className="flex items-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`${i + 1}枚目を表示`}
                aria-current={i === index}
                onClick={() => go(i)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === index ? "bg-white" : "bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
