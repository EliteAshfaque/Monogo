import { useState } from "react";
export function ResetPasswordModal({ onSubmit }) {
  const [password, setPassword] = useState("");
  return <div className="modal"><form onSubmit={event => { event.preventDefault(); onSubmit(password); }}><h2>Choose a new password</h2><p>Use at least 8 characters.</p><input required minLength="8" type="password" placeholder="New password" value={password} onChange={event => setPassword(event.target.value)} /><button>Update password</button></form></div>;
}
