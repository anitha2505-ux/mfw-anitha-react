import React, { useEffect, useState } from "react";
import { fetchProducts } from "../services/productApi";
import { getStoredProducts, hasStoredProducts, saveStoredProducts } from "../services/productStorage";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", category: "Grooming", price: "", stock: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    async function init() {
      if (hasStoredProducts()) {
        setProducts(getStoredProducts());
      } else {
        const jsonProducts = await fetchProducts();
        setProducts(jsonProducts);
        saveStoredProducts(jsonProducts);
      }
    }
    init();
  }, []);

  function onChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function resetForm() {
    setForm({ name: "", category: "Grooming", price: "", stock: "" });
    setEditId(null);
  }

  function addProduct() {
    const price = Number(form.price);
    const stock = Number(form.stock);
    if (!form.name.trim() || !Number.isFinite(price) || !Number.isFinite(stock)) return;

    const newProduct = {
      id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
      name: form.name.trim(),
      category: form.category,
      price,
      stock,
      image: "/images/placeholder.jpg",
      description: "Admin-created product"
    };

    const next = [...products, newProduct];
    setProducts(next);
    saveStoredProducts(next);
    resetForm();
  }

  function startEdit(p) {
    setEditId(p.id);
    setForm({ name: p.name, category: p.category, price: String(p.price), stock: String(p.stock) });
  }

  function updateProduct() {
    const price = Number(form.price);
    const stock = Number(form.stock);
    if (!editId || !form.name.trim() || !Number.isFinite(price) || !Number.isFinite(stock)) return;

    const next = products.map(p =>
      p.id === editId ? { ...p, name: form.name.trim(), category: form.category, price, stock } : p
    );
    setProducts(next);
    saveStoredProducts(next);
    resetForm();
  }

  function deleteProduct(id) {
    const next = products.filter(p => p.id !== id);
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
          <input className="form-control mb-3" name="stock" value={form.stock} onChange={onChange} />

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
          {products.map(p => (
            <div key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-semibold">{p.name}</div>
                <div className="text-muted small">{p.category} · ${p.price.toFixed(2)} · Stock {p.stock}</div>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-primary" onClick={()=>startEdit(p)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={()=>deleteProduct(p.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
