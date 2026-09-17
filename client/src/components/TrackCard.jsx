import { formatDuration } from "../lib/api";

export function TrackCard({ track, liked, onPlay, onToggleLike, onAddToPlaylist }) {
  return <article className="track" onClick={() => onPlay(track)}>
    <div className="cover"><img src={track.coverImage || "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=500&q=80"} alt="" /><b>▶</b></div>
    <h3>{track.title} {track.isPremium && <em>Premium</em>}<button className={`like ${liked ? "liked" : ""}`} onClick={event => onToggleLike(event, track)}>{liked ? "♥" : "♡"}</button></h3>
    <p>{track.artist?.name || "Unknown artist"}</p>
    <small>{formatDuration(track.duration || 0)} · {track.plays?.toLocaleString()} plays</small><button className="add-playlist" onClick={event => { event.stopPropagation(); onAddToPlaylist(track); }}>＋ Add to playlist</button>
  </article>;
}
