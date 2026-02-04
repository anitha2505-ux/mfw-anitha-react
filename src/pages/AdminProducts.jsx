import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { productsAtom } from "../store/atoms";
import { fetchProducts } from "../services/productApi";
import { getStoredProducts, hasStoredProducts, saveStoredProducts } from "../services/productStorage";

export default function AdminProducts() {
  const [products, setProducts] = useAtom(productsAtom);

  const [form, setForm] = useState({
    name: "",
    category: "Grooming",
    price: "",
    stock: "",
    description: ""
  });
  const [editId, setEditId] = useState(null);

  // Ensure products is initialised if user lands here first
  useEffect(() => {
    async function init() {
      if (products && products.length > 0) return;

      if (hasStoredProducts()) {
        setProducts(getStoredProducts());
      } else {
        const jsonProducts = await fetchProducts();
        setProducts(jsonProducts);
        saveStoredProducts(jsonProducts);
      }
    }
    init();
  }, [products, setProducts]);

  function onChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function resetForm() {
    setForm({
      name: "",
      category: "Grooming",
      price: "",
      stock: "",
      description: ""
    });
    setEditId(null);
  }

  function addProduct() {
    const name = form.name.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!name || !Number.isFinite(price) || !Number.isFinite(stock)) return;

    const nextId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

    const newProduct = {
      id: nextId,
      name,
      category: form.category,
      price,
      stock,
      image: "/images/placeholder.jpg",
      description: form.description.trim() || "Admin-created product"
    };

    const next = [...products, newProduct];
    setProducts(next);
    saveStoredProducts(next);
    resetForm();
  }

  function startEdit(p) {
    setEditId(p.id);
    setForm({
      name: p.name ?? "",
      category: p.category ?? "Grooming",
      price: String(p.price ?? ""),
      stock: String(p.stock ?? ""),
      description: p.description ?? ""
    });
  }

  function updateProduct() {
    const name = form.name.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!editId || !name || !Number.isFinite(price) || !Number.isFinite(stock)) return;

    const next = products.map((p) =>
      p.id === editId
        ? {
            ...p,
            name,
            category: form.category,
            price,
            stock,
            description: form.description.trim() || p.description
          }
        : p
    );

    setProducts(next);
    saveStoredProducts(next);
    resetForm();
  }

  function deleteProduct(id) {
    const next = products.filter((p) => p.id !== id);
    setProducts(next);
    saveStoredProducts(next);
    if (editId === id) resetForm();
  }

  return (
    <div className="row g-3">
      <div className="col-12 col-lg-5">
        <div className="border rounded p-3">
          <h4 className="mb-3">{editId ? "Edit Product" : "Add Product"}</h4>

          <label className="form-label">Name</label>
          <input className="form-control mb-2" name="name" value={form.name} onChange={onChange} />

          <label className="form-label">Category</label>
          <select className="form-select mb-2" name="category" value={form.category} onChange={onChange}>
            <option value="Grooming">Grooming</option>
            <option value="Food">Food</option>
            <option value="Health">Health</option>
            <option value="Accessories">Accessories</option>
          </select>

          <label className="form-label">Price</label>
          <input className="form-control mb-2" name="price" value={form.price} onChange={onChange} />

          <label className="form-label">Stock</label>
          <input className="form-control mb-2" name="stock" value={form.stock} onChange={onChange} />

          <label className="form-label">Description</label>
          <textarea className="form-control mb-3" rows="3" name="description" value={form.description} onChange={onChange} />

          <div className="d-flex gap-2">
            {editId ? (
              <>
                <button className="btn btn-success" onClick={updateProduct}>Update</button>
                <button className="btn btn-outline-secondary" onClick={resetForm}>Cancel</button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={addProduct}>Add</button>
            )}
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-7">
        <h3 className="mb-2">Products ({products.length})</h3>
        <div className="list-group">
          {products.map((p) => (
            <div key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-semibold">{p.name}</div>
                <div className="text-muted small">
                  {p.category} · ${Number(p.price).toFixed(2)} · Stock {p.stock}
                </div>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(p)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProduct(p.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-muted small mt-2">
          Changes are saved to localStorage and reflected immediately in the storefront.
        </div>
      </div>
    </div>
  );
}
