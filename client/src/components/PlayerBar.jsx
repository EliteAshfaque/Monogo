export function PlayerBar({ track, audioRef, playlists, onAddToPlaylist, onClose }) {
  if (!track) return null;
  return <footer>
    <img src={track.coverImage} alt="" /><div><b>{track.title}</b><span>{track.artist?.name}</span></div>
    <audio ref={audioRef} controls src={track.uri} />
    {playlists.length > 0 && <select aria-label="Add to playlist" defaultValue="" onChange={event => { onAddToPlaylist(event.target.value); event.target.value = ""; }}><option value="">＋ Playlist</option>{playlists.map(playlist => <option value={playlist._id} key={playlist._id}>{playlist.name}</option>)}</select>}
    <button onClick={onClose}>×</button>
  </footer>;
}
