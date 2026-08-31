// 任意の動画/音声ファイルから、ブラウザ内で音声だけを抽出する。
// captureStream + MediaRecorder（ffmpeg.wasm も COOP/COEP も不要）。元動画は端末外に出ない。
type WithCapture = HTMLMediaElement & {
  captureStream?: () => MediaStream;
  mozCaptureStream?: () => MediaStream;
};

export async function extractAudio(
  file: File,
  maxSeconds = 60,
  onProgress?: (ratio: number) => void,
): Promise<Blob> {
  const url = URL.createObjectURL(file);
  const el = document.createElement("video") as WithCapture;
  el.src = url;
  el.muted = true;
  (el as HTMLVideoElement).playsInline = true;

  try {
    await new Promise<void>((resolve, reject) => {
      el.onloadedmetadata = () => resolve();
      el.onerror = () => reject(new Error("load_failed"));
    });

    const capture = el.captureStream ?? el.mozCaptureStream;
    if (!capture) throw new Error("capture_unsupported");
    const stream = capture.call(el);
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) throw new Error("no_audio_track");

    const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : "audio/webm";
    const rec = new MediaRecorder(new MediaStream(audioTracks), {
      mimeType: mime,
    });
    const chunks: BlobPart[] = [];
    rec.ondataavailable = (e) => {
      if (e.data.size) chunks.push(e.data);
    };
    const stopped = new Promise<Blob>((resolve) => {
      rec.onstop = () => resolve(new Blob(chunks, { type: "audio/webm" }));
    });

    rec.start();
    await el.play();
    const stopAt = Math.min(maxSeconds, el.duration || maxSeconds);

    await new Promise<void>((resolve) => {
      const tick = () => {
        onProgress?.(Math.min(1, el.currentTime / stopAt));
        if (el.currentTime >= stopAt || el.ended) resolve();
        else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });

    rec.stop();
    el.pause();
    return await stopped;
  } finally {
    URL.revokeObjectURL(url);
  }
}
