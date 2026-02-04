import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { signup } from "../services/authStorage";

export default function Signup() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // allow admin creation for demo
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    setError("");
    try {
      signup({ email: email.trim(), password, role });
      setLocation("/login");
    } catch (err) {
      setError(err.message || "Signup failed.");
    }
  }

  return (
    <div className="col-12 col-md-6 col-lg-4 mx-auto">
      <h2 className="mb-3">Sign Up</h2>
      {error ? <div className="alert alert-danger">{error}</div> : null}

      <form onSubmit={submit} className="border rounded p-3">
        <label className="form-label">Email</label>
        <input className="form-control mb-2" value={email} onChange={(e)=>setEmail(e.target.value)} />

        <label className="form-label">Password</label>
        <input className="form-control mb-2" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />

        <label className="form-label">Role (demo)</label>
        <select className="form-select mb-3" value={role} onChange={(e)=>setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button className="btn btn-primary w-100" type="submit">Create Account</button>
      </form>

      <div className="mt-2">
        Already have an account? <Link href="/login">Login</Link>
      </div>
    </div>
  );
}
