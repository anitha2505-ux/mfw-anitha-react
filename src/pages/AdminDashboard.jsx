import React from "react";
import { Link } from "wouter";

export default function AdminDashboard({ auth }) {
  return (
    <div className="border rounded p-4">
      <h2 className="mb-2">Admin Dashboard</h2>
      <div className="text-muted mb-3">Signed in as: {auth.email}</div>

      <div className="d-flex gap-2">
        <Link className="btn btn-primary" href="/admin/products">Manage Products</Link>
        <Link className="btn btn-outline-secondary" href="/products">View Storefront</Link>
      </div>
    </div>
  );
}
