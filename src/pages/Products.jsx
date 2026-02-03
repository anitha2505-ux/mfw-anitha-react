import React, { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";

export default function Products({ products, onAddToCart }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase().trim());
      const matchesCategory = category === "All" || p.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  return (
    <>
      <div className="d-flex flex-wrap gap-2 align-items-end mb-3">
        <div>
          <label className="form-label">Search</label>
          <input
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g., shampoo"
          />
        </div>

        <div>
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="alert alert-info">No products match your filters.</div>
      ) : (
        <div className="row g-3">
          {filtered.map((p) => (
            <div className="col-12 col-md-6 col-lg-4" key={p.id}>
              <ProductCard product={p} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
