import React, { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { useSetAtom } from "jotai";
import { orderAtom } from "../store/atoms";
import { useCartActions } from "../store/cartActions";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const setOrder = useSetAtom(orderAtom);
  const { cart, clearCart } = useCartActions();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("Standard");

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.qty), 0);
    const shippingFee = subtotal > 0 ? 5 : 0;
    const grandTotal = subtotal + shippingFee;
    return { subtotal, shippingFee, grandTotal };
  }, [cart]);

  const canSubmit = useMemo(() => {
    if (cart.length === 0) return false;
    if (!fullName.trim()) return false;
    if (!email.trim()) return false;
    if (!address.trim()) return false;
    return true;
  }, [cart.length, fullName, email, address]);

  if (cart.length === 0) {
    return (
      <div className="alert alert-warning">
        Your cart is empty. <Link href="/products">Browse products</Link>
      </div>
    );
  }

  function submit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      items: cart,
      customer: {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        deliveryOption
      },
      totals,
      createdAt: new Date().toISOString()
    };

    setOrder(newOrder);
    clearCart();
    setLocation("/confirmation");
  }

  return (
    <div className="row g-3">
      <div className="col-12 col-lg-7">
        <h2 className="mb-3">Checkout</h2>

        <form onSubmit={submit} className="border rounded p-3">
          <div className="mb-2">
            <label className="form-label">Full Name *</label>
            <input className="form-control" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>

          <div className="mb-2">
            <label className="form-label">Email *</label>
            <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="mb-2">
            <label className="form-label">Phone</label>
            <input className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="mb-2">
            <label className="form-label">Address *</label>
            <textarea className="form-control" rows="3" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Delivery Option</label>
            <select className="form-select" value={deliveryOption} onChange={(e) => setDeliveryOption(e.target.value)}>
              <option value="Standard">Standard (2–4 days)</option>
              <option value="Express">Express (1–2 days)</option>
            </select>
          </div>

          <button className="btn btn-success" type="submit" disabled={!canSubmit}>
            Place Order (No Payment)
          </button>
        </form>
      </div>

      <div className="col-12 col-lg-5">
        <div className="border rounded p-3">
          <h4>Order Summary</h4>

          <ul className="list-group mb-3">
            {cart.map((item) => (
              <li key={item.productId} className="list-group-item d-flex justify-content-between">
                <span>
                  {item.name} × {item.qty}
                </span>
                <span>${(Number(item.price) * Number(item.qty)).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div className="d-flex justify-content-between">
            <span>Subtotal</span>
            <span>${totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Shipping</span>
            <span>${totals.shippingFee.toFixed(2)}</span>
          </div>
          <hr />
          <div className="d-flex justify-content-between fw-bold">
            <span>Total</span>
            <span>${totals.grandTotal.toFixed(2)}</span>
          </div>

          <Link className="btn btn-outline-secondary w-100 mt-3" href="/cart">
            Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
