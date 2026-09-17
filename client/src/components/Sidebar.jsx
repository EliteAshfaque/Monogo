export function Sidebar({ user, playlists, likedCount, onLogin, onCreatePlaylist }) {
  return <aside>
    <div className="brand"><i>◉</i> sonora</div>
    <nav><button className="active">⌂ Home</button><button>⌕ Search</button><button>▣ Your Library</button></nav>
    <div className="library">
      <b>Your playlists</b>
      <button onClick={onCreatePlaylist}>＋ Create playlist</button>
      <small>♥ Liked Songs ({likedCount})</small>
      {playlists.length ? playlists.map(playlist => <small key={playlist._id}>♫ {playlist.name}</small>) : <small>Build your perfect soundtrack.</small>}
    </div>
    <div className="account">{user ? <><b>{user.username}</b><span>{user.plan === "premium" ? "Premium" : "Free"}</span></> : <button onClick={onLogin}>Log in</button>}</div>
  </aside>;
}
