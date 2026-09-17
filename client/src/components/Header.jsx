export function Header({ query, onQueryChange, user, onShowPlans, onProfile }) {
  return <header>
    <div className="search">⌕ <input value={query} onChange={event => onQueryChange(event.target.value)} placeholder="What do you want to play?" /></div>
    <div><button className="ghost" onClick={onShowPlans}>Explore Premium</button>{user && <button className="avatar" onClick={onProfile} title="Edit profile">{user.username[0]?.toUpperCase()}</button>}</div>
  </header>;
}
