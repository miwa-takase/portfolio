import Breadcrumb from "../components/Breadcrumb";
import TrackCard from "../components/TrackCard";
import SpotifyNowPlaying from "../demos/SpotifyNowPlaying";

// お気に入り曲（NOW PLAYING と同じカードスタイルで表示）
type FavoriteTrack = {
  id: string;
  title: string;
  artist: string;
  art: string; // Spotify 画像ハッシュ（i.scdn.co/image/{art}）
};

const FAVORITE_TRACKS: FavoriteTrack[] = [
  {
    id: "0ioheYrQrx7e2hMAVWPTnL",
    title: "I DO NOT LOVE YOU.",
    artist: "キタニタツヤ",
    art: "ab67616d00001e027ceeaf938856061afe737a00",
  },
  {
    id: "20zT9Nef5p2RPrUGtuSWRz",
    title: "Noah's Ark",
    artist: "ぼくのりりっくのぼうよみ",
    art: "ab67616d00001e029561571a5b8530be71b16eb1",
  },
  {
    id: "5q9eqdCuKvJn5AumnjAOgK",
    title: "negai",
    artist: "嵐",
    art: "ab67616d00001e02b6aefe7d3a9319e9f3e9ed77",
  },
  {
    id: "2YLwxR4HLqsBdQG2Uw3J5C",
    title: "GRL GVNG",
    artist: "XG",
    art: "ab67616d00001e02e9b58064013b722f09296b3e",
  },
  {
    id: "14QUJsesLiDdZ4oifIWOxN",
    title: "ロウラヴ",
    artist: "King Gnu",
    art: "ab67616d00001e02f0d02ba8facfe07e3e5a6eef",
  },
  {
    id: "0Po8a9ZRgWxpMycjiyf2sA",
    title: "lost and found",
    artist: "millennium parade",
    art: "ab67616d00001e02d79a2a84e6806825319c64c2",
  },
  {
    id: "1q6Jz5HtMDOfmVwgR3f20u",
    title: "恵日",
    artist: "小林私",
    art: "ab67616d00001e02a49dd87f19efd38e11ed1710",
  },
  {
    id: "0HM0hQIRGYBxqxOAg9J9U5",
    title: "愚弄 - DEMO ver.",
    artist: "RAISAN",
    art: "ab67616d00001e02166fa5f398c8e5653f5f588f",
  },
  {
    id: "4uaqXu1luljn5Y8Yle9BYp",
    title: "KARMA CITY",
    artist: "Kenshi Yonezu",
    art: "ab67616d00001e024f220d17ad81c943221ce335",
  },
  {
    id: "1UmOWyEsNUzanJRqXdAFUT",
    title: "マスカラ",
    artist: "SixTONES",
    art: "ab67616d00001e026fa770e8ff2077c7f9b81391",
  },
  {
    id: "3RUXMUcuFnfMgI20Tx5LeT",
    title: "亜東京 (feat. キタニタツヤ)",
    artist: "PAS TASTA",
    art: "ab67616d00001e02fb7404f6301c8551f79bfb0a",
  },
];

export default function Music() {
  return (
    <section className="wrap py-16">
      <Breadcrumb items={[{ label: "Music" }]} />

      <div className="max-w-2xl pt-6">
        <h1 className="display-title font-serif text-4xl font-medium italic leading-tight md:text-6xl">
          Music
        </h1>
        <p className="mt-4 text-base text-paper-dim">
          Spotify の再生状況を表示します
        </p>
      </div>

      <div className="mt-8 max-w-sm">
        <SpotifyNowPlaying />
      </div>

      <section className="mt-12" aria-labelledby="favorite-music-title">
        <h2
          id="favorite-music-title"
          className="mb-5 text-sm uppercase tracking-widest text-muted"
        >
          Favorite Music
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FAVORITE_TRACKS.map((track) => (
            <a
              key={track.id}
              href={`https://open.spotify.com/track/${track.id}`}
              target="_blank"
              rel="noreferrer"
              className="utility-frame block transition-colors hover:border-accent"
              aria-label={`${track.title} / ${track.artist} を Spotify で開く`}
            >
              <TrackCard
                albumArt={`https://i.scdn.co/image/${track.art}`}
                title={track.title}
                artist={track.artist}
              />
            </a>
          ))}
        </div>
      </section>
    </section>
  );
}
