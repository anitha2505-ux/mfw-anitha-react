import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { useAtomValue } from "jotai";
import { productsAtom } from "../store/atoms";
import { useCartActions } from "../store/cartActions";

export default function ProductDetails({ id }) {
  const productId = Number(id);
  const products = useAtomValue(productsAtom);
  const { addToCart } = useCartActions();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  // Re-sync whenever products or route id changes (auto-refresh after admin CRUD)
  useEffect(() => {
    const found = products.find((p) => p.id === productId) || null;
    setProduct(found);
  }, [products, productId]);

  if (!product) {
    return (
      <div className="alert alert-warning">
        Product not found or was deleted.
        <div className="mt-2">
          <Link href="/products">Back to Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="row g-3">
      <div className="col-12 col-md-5">
        <img
          src={product.image}
          className="img-fluid rounded"
          alt={product.name}
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/900x600?text=PetCare+Product";
          }}
        />
      </div>

      <div className="col-12 col-md-7">
        <h2>{product.name}</h2>
        <div className="text-muted mb-2">{product.category}</div>
        <h4 className="mb-3">${Number(product.price).toFixed(2)}</h4>
        <p>{product.description}</p>
        <p className="text-muted">Stock: {product.stock}</p>

        <div className="d-flex gap-2 align-items-end">
          <div style={{ maxWidth: 120 }}>
            <label className="form-label">Quantity</label>
            <input
              className="form-control"
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={() => addToCart(product, qty)}
            disabled={Number(product.stock) <= 0}
          >
            Add to Cart
          </button>

          <Link className="btn btn-outline-secondary" href="/products">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}
