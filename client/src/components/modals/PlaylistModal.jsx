import { useState } from "react";
export function PlaylistModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  return <div className="modal"><form onSubmit={event => { event.preventDefault(); onCreate(name); }}><button type="button" className="close" onClick={onClose}>×</button><h2>Create playlist</h2><input required maxLength="80" placeholder="My playlist" value={name} onChange={event => setName(event.target.value)} /><button>Create playlist</button></form></div>;
}
