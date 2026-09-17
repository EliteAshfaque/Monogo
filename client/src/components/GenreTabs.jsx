export function GenreTabs({ genres, selected, onSelect }) {
  return <div className="genre-tabs">{genres.map(genre => <button key={genre} className={selected === genre ? "selected" : ""} onClick={() => onSelect(genre)}>{genre}</button>)}</div>;
}
