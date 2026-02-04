import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { login } from "../services/authStorage";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const auth = login({ email: email.trim(), password });
      setLocation(auth.role === "admin" ? "/admin" : "/products");
    } catch (err) {
      setError(err.message || "Login failed.");
    }
  }

  return (
    <div className="col-12 col-md-6 col-lg-4 mx-auto">
      <h2 className="mb-3">Login</h2>
      {error ? <div className="alert alert-danger">{error}</div> : null}

      <form onSubmit={submit} className="border rounded p-3">
        <label className="form-label">Email</label>
        <input className="form-control mb-2" value={email} onChange={(e)=>setEmail(e.target.value)} />

        <label className="form-label">Password</label>
        <input className="form-control mb-3" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />

        <button className="btn btn-success w-100" type="submit">Login</button>
      </form>

      <div className="mt-2">
        No account? <Link href="/signup">Sign up</Link>
      </div>
    </div>
  );
}
