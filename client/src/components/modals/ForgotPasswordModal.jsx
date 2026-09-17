import { useState } from "react";
export function ForgotPasswordModal({ onClose, onSubmit }) {
  const [email, setEmail] = useState("");
  return <div className="modal"><form onSubmit={event => { event.preventDefault(); onSubmit(email); }}><button type="button" className="close" onClick={onClose}>×</button><h2>Reset password</h2><p>Enter your email and we’ll send a reset link.</p><input required type="email" placeholder="Email" value={email} onChange={event => setEmail(event.target.value)} /><button>Send reset link</button></form></div>;
}
