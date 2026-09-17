import { useState } from "react";

export function AuthModal({ onClose, onSubmit, onForgot }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const submit = event => { event.preventDefault(); onSubmit(mode, mode === "register" ? form : { email: form.email, password: form.password }); };
  return <div className="modal"><form onSubmit={submit}><button type="button" className="close" onClick={onClose}>×</button><h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>{mode === "register" && <input required placeholder="Username" value={form.username} onChange={event => setForm({ ...form, username: event.target.value })} />}<input required type="email" placeholder="Email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} /><input required type="password" placeholder="Password" value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} /><button>Continue</button>{mode === "login" && <p onClick={onForgot}>Forgot password?</p>}<p onClick={() => setMode(mode === "login" ? "register" : "login")}>{mode === "login" ? "New here? Sign up" : "Already have an account? Log in"}</p></form></div>;
}
