import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { productsAtom } from "../store/atoms";
import { fetchProducts } from "../services/productApi";
import { getStoredProducts, hasStoredProducts, saveStoredProducts } from "../services/productStorage";
import FlashMessage from "../components/FlashMessage";

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminProducts() {
  const [products, setProducts] = useAtom(productsAtom);

  const [form, setForm] = useState({
    name: "",
    category: "Grooming",
    price: "",
    stock: "",
    description: "",
    image: ""
  });

  const [editId, setEditId] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Flash message state
  const [flash, setFlash] = useState(null);

  function showFlash(type, title, message) {
    setFlash({ type, title, message, ts: Date.now() });
  }

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null); // product object or null

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

  async function onImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showFlash("danger", "Invalid Image", "Please upload a valid image file.");
      return;
    }

    // localStorage is limited; keep images reasonably small
    if (file.size > 800_000) {
      showFlash("warning", "Image Too Large", "Please upload an image under ~800 KB.");
      return;
    }

    const dataUrl = await fileToDataUrl(file);
    setForm((prev) => ({ ...prev, image: dataUrl }));
    setImagePreview(dataUrl);

    showFlash("info", "Image Selected", "Click Add/Update to save the image.");
  }

  function resetForm(showMessage = false) {
    setForm({
      name: "",
      category: "Grooming",
      price: "",
      stock: "",
      description: "",
      image: ""
    });
    setImagePreview("");
    setEditId(null);

    const fileInput = document.getElementById("productImageUpload");
    if (fileInput) fileInput.value = "";

    if (showMessage) showFlash("info", "Cancelled", "Form cleared.");
  }

  function validateForm() {
    const name = form.name.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!name) return { ok: false, message: "Product name is required." };
    if (!Number.isFinite(price) || price < 0) return { ok: false, message: "Price must be a valid number (0 or above)." };
    if (!Number.isFinite(stock) || stock < 0) return { ok: false, message: "Stock must be a valid number (0 or above)." };

    return { ok: true, name, price, stock };
  }

  function addProduct() {
    const v = validateForm();
    if (!v.ok) {
      showFlash("danger", "Validation Error", v.message);
      return;
    }

    const nextId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

    const newProduct = {
      id: nextId,
      name: v.name,
      category: form.category,
      price: v.price,
      stock: v.stock,
      image: form.image || "/images/placeholder.jpg",
      description: form.description.trim() || "Admin-created product"
    };

    const next = [...products, newProduct];
    setProducts(next);
    saveStoredProducts(next);

    resetForm(false);
    showFlash("success", "Created", `Product "${newProduct.name}" was added successfully.`);
  }

  function startEdit(p) {
    setEditId(p.id);
    setForm({
      name: p.name ?? "",
      category: p.category ?? "Grooming",
      price: String(p.price ?? ""),
      stock: String(p.stock ?? ""),
      description: p.description ?? "",
      image: p.image ?? ""
    });
    setImagePreview(p.image ?? "");

    const fileInput = document.getElementById("productImageUpload");
    if (fileInput) fileInput.value = "";

    showFlash("info", "Edit Mode", `Editing "${p.name}".`);
  }

  function updateProduct() {
    const v = validateForm();
    if (!v.ok) {
      showFlash("danger", "Validation Error", v.message);
      return;
    }

    if (!editId) {
      showFlash("warning", "No Selection", "Please select a product to edit.");
      return;
    }

    const next = products.map((p) =>
      p.id === editId
        ? {
            ...p,
            name: v.name,
            category: form.category,
            price: v.price,
            stock: v.stock,
            description: form.description.trim() || p.description,
            image: form.image || p.image
          }
        : p
    );

    setProducts(next);
    saveStoredProducts(next);

    resetForm(false);
    showFlash("success", "Updated", `Product "${v.name}" was updated successfully.`);
  }

  // --- Delete via Bootstrap modal ---
  function requestDelete(product) {
    setDeleteTarget(product);
    showFlash("warning", "Confirm Delete", `Please confirm deleting "${product.name}".`);
  }

  function confirmDelete() {
    if (!deleteTarget) return;

    const next = products.filter((p) => p.id !== deleteTarget.id);
    setProducts(next);
    saveStoredProducts(next);

    if (editId === deleteTarget.id) resetForm(false);

    showFlash("warning", "Deleted", `Product "${deleteTarget.name}" has been removed.`);
    setDeleteTarget(null);
  }

  function cancelDelete() {
    showFlash("info", "Delete Cancelled", "No changes were made.");
    setDeleteTarget(null);
  }

  return (
    <>
      {/* Animated Bootstrap flash (top-right) */}
      <FlashMessage flash={flash} onClose={() => setFlash(null)} />

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
            <textarea className="form-control mb-2" rows="3" name="description" value={form.description} onChange={onChange} />

            <label className="form-label">Product Image</label>
            <input
              id="productImageUpload"
              className="form-control mb-2"
              type="file"
              accept="image/*"
              onChange={onImageChange}
            />

            {imagePreview ? (
              <div className="mb-3">
                <div className="text-muted small mb-1">Preview</div>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="rounded border"
                  style={{ width: "100%", height: 180, objectFit: "cover" }}
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/900x600?text=PetCare+Product";
                  }}
                />
                <div className="mt-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, image: "" }));
                      setImagePreview("");
                      const fileInput = document.getElementById("productImageUpload");
                      if (fileInput) fileInput.value = "";
                      showFlash("info", "Image Removed", "Click Add/Update to save changes.");
                    }}
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            ) : null}

            <div className="d-flex gap-2">
              {editId ? (
                <>
                  <button className="btn btn-success" onClick={updateProduct}>Update</button>
                  <button className="btn btn-outline-secondary" onClick={() => resetForm(true)}>Cancel</button>
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
                <div className="d-flex gap-3 align-items-center">
                  <img
                    src={p.image}
                    alt={p.name}
                    width="56"
                    height="56"
                    className="rounded border"
                    style={{ objectFit: "cover" }}
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/112?text=Img";
                    }}
                  />

                  <div>
                    <div className="fw-semibold">{p.name}</div>
                    <div className="text-muted small">
                      {p.category} · ${Number(p.price).toFixed(2)} · Stock {p.stock}
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(p)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => requestDelete(p)}>Delete</button>
                </div>
              </div>
            ))}
          </div>

          
        </div>
      </div>

      {/* Bootstrap modal confirm delete (React-controlled, no Bootstrap JS needed) */}
      {deleteTarget && (
        <>
          {/* Backdrop */}
          <div className="modal-backdrop fade show"></div>

          {/* Modal */}
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-danger">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={cancelDelete}
                    aria-label="Close"
                  />
                </div>

                <div className="modal-body">
                  <p className="fw-semibold mb-1">Are you sure you want to delete this product?</p>
                  <p className="mb-0">
                    <strong>{deleteTarget.name}</strong>
                  </p>
                  <p className="text-muted small mt-2">This action cannot be undone.</p>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={cancelDelete}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
