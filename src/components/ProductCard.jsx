import React from "react";
import { Link } from "wouter";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="card h-100">
      <img
        src={product.image}
        className="card-img-top"
        alt={product.name}
        style={{ objectFit: "cover", height: 180 }}
        onError={(e) => {
          e.currentTarget.src =
            "https://via.placeholder.com/640x360?text=PetCare+Product";
        }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="text-muted mb-1">{product.category}</p>
        <p className="mb-3">${product.price.toFixed(2)}</p>

        <div className="mt-auto d-flex gap-2">
          <Link className="btn btn-outline-secondary btn-sm" href={`/products/${product.id}`}>
            View
          </Link>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onAddToCart(product, 1)}
            disabled={product.stock <= 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
