import React from "react";

export default function CartItem({ item, onUpdateQty, onRemove }) {
  return (
    <div className="d-flex align-items-center gap-3 border rounded p-2 mb-2">
      <img
        src={item.image}
        alt={item.name}
        width="64"
        height="64"
        style={{ objectFit: "cover" }}
        onError={(e) => {
          e.currentTarget.src =
            "https://via.placeholder.com/128?text=Item";
        }}
      />

      <div className="flex-grow-1">
        <div className="fw-semibold">{item.name}</div>
        <div className="text-muted">${item.price.toFixed(2)}</div>
      </div>

      <div style={{ maxWidth: 110 }}>
        <label className="form-label mb-0 small">Qty</label>
        <input
          className="form-control"
          type="number"
          min="1"
          value={item.qty}
          onChange={(e) => onUpdateQty(item.productId, Number(e.target.value))}
        />
      </div>

      <div className="text-end" style={{ minWidth: 120 }}>
        <div className="fw-semibold">
          ${(item.price * item.qty).toFixed(2)}
        </div>
        <button
          className="btn btn-link text-danger p-0"
          onClick={() => onRemove(item.productId)}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
