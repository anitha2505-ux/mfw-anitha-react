import React from "react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="p-4 bg-light rounded">
      <h1 className="mb-2">PawfectCare Products</h1>
      <p className="mb-3">
        Browse grooming, food, and health essentials. 
      </p>
      <Link className="btn btn-primary" href="/products">
        Browse Products
      </Link>
    </div>
  );
}
