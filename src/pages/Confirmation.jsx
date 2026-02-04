import React from "react";
import { Link } from "wouter";
import { useAtomValue } from "jotai";
import { orderAtom } from "../store/atoms";

export default function Confirmation() {
  const order = useAtomValue(orderAtom);

  if (!order) {
    return (
      <div className="alert alert-warning">
        No order found. <Link href="/products">Return to Products</Link>
      </div>
    );
  }

  return (
    <div className="border rounded p-4">
      <h2 className="mb-2">Order Confirmed</h2>
      <div className="text-muted mb-3">
        Order ID: <span className="fw-semibold">{order.id}</span>
      </div>

      <h5>Customer</h5>
      <p className="mb-3">
        {order.customer.fullName}
        <br />
        {order.customer.email}
        {order.customer.phone ? (
          <>
            <br />
            {order.customer.phone}
          </>
        ) : null}
        <br />
        {order.customer.address}
        <br />
        Delivery: {order.customer.deliveryOption}
      </p>

      <h5>Items</h5>
      <ul className="list-group mb-3">
        {order.items.map((item) => (
          <li key={item.productId} className="list-group-item d-flex justify-content-between">
            <span>
              {item.name} × {item.qty}
            </span>
            <span>${(Number(item.price) * Number(item.qty)).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <div className="d-flex justify-content-between fw-bold">
        <span>Total</span>
        <span>${Number(order.totals.grandTotal).toFixed(2)}</span>
      </div>

      <Link className="btn btn-primary mt-3" href="/products">
        Continue Shopping
      </Link>
    </div>
  );
}
