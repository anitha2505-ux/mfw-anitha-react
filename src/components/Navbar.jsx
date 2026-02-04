import React from "react";
import { Link, useLocation } from "wouter";
import { useAtomValue } from "jotai";
import { cartAtom } from "../store/atoms";
import { getAuth, clearAuth } from "../services/authStorage";

export default function Navbar() {
  const [, setLocation] = useLocation();
  const cart = useAtomValue(cartAtom);
  const cartCount = cart.reduce((n, i) => n + Number(i.qty || 0), 0);

  const auth = getAuth();

  function logout() {
    clearAuth();
    setLocation("/");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" href="/">
          PawfectCare Shop
        </Link>

        <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
          <Link className="nav-link" href="/products">
            Products
          </Link>

          <Link className="nav-link" href="/cart">
            Cart ({cartCount})
          </Link>

          <Link className="nav-link" href="/checkout">
            Checkout
          </Link>

          {auth ? (
            <>
              {auth.role === "admin" && (
                <Link className="nav-link" href="/admin">
                  Admin
                </Link>
              )}

              <span className="navbar-text text-light me-2">{auth.email}</span>

              <button className="btn btn-sm btn-outline-light" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link" href="/login">
                Login
              </Link>
              <Link className="nav-link" href="/signup">
                Sign Up
              </Link>
              <Link className="nav-link" href="/subscribe">
                Subscribe
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
