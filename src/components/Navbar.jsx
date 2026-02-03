import React from "react";
import { Link } from "wouter";

export default function Navbar({ cartCount }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" href="/">
          PetCare Shop
        </Link>

        <div className="navbar-nav ms-auto">
          <Link className="nav-link" href="/products">
            Products
          </Link>
          <Link className="nav-link" href="/cart">
            Cart ({cartCount})
          </Link>
          <Link className="nav-link" href="/checkout">
            Checkout
          </Link>
        </div>
      </div>
    </nav>
  );
}
