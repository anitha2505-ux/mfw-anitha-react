import React, { useEffect, useMemo, useState } from "react";
import { Route, Switch, useLocation } from "wouter";
import { fetchProducts } from "./services/productApi";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";

export default function App() {
  const [, setLocation] = useLocation();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]); // { productId, name, price, qty, image }
  const [order, setOrder] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await fetchProducts();
      setProducts(data);
    }
    load();
  }, []);

  function addToCart(product, qty = 1) {
    if (!product) return;

    setCart((prev) => {
      const existing = prev.find((x) => x.productId === product.id);
      if (existing) {
        return prev.map((x) =>
          x.productId === product.id ? { ...x, qty: x.qty + qty } : x
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          qty,
          image: product.image
        }
      ];
    });
  }

  function updateQty(productId, nextQty) {
    const safeQty = Number.isFinite(nextQty) ? nextQty : 1;

    setCart((prev) => {
      if (safeQty <= 0) return prev.filter((x) => x.productId !== productId);
      return prev.map((x) =>
        x.productId === productId ? { ...x, qty: safeQty } : x
      );
    });
  }

  function removeFromCart(productId) {
    setCart((prev) => prev.filter((x) => x.productId !== productId));
  }

  function clearCart() {
    setCart([]);
  }

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shippingFee = subtotal > 0 ? 5 : 0;
    const grandTotal = subtotal + shippingFee;
    return { subtotal, shippingFee, grandTotal };
  }, [cart]);

  function placeOrder(customer) {
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      items: cart,
      customer,
      totals,
      createdAt: new Date().toISOString()
    };
    setOrder(newOrder);
    clearCart();
    setLocation("/confirmation");
  }

  return (
    <>
      <Navbar cartCount={cart.reduce((n, i) => n + i.qty, 0)} />

      <div className="container py-4">
        <Switch>
          <Route path="/" component={Home} />

          <Route path="/products">
            <Products products={products} onAddToCart={addToCart} />
          </Route>

          <Route path="/products/:id">
            {(params) => (
              <ProductDetails
                id={params.id}
                products={products}
                onAddToCart={addToCart}
              />
            )}
          </Route>

          <Route path="/cart">
            <Cart
              cart={cart}
              totals={totals}
              onUpdateQty={updateQty}
              onRemove={removeFromCart}
            />
          </Route>

          <Route path="/checkout">
            <Checkout cart={cart} totals={totals} onPlaceOrder={placeOrder} />
          </Route>

          <Route path="/confirmation">
            <Confirmation order={order} />
          </Route>

          <Route>
            <div className="alert alert-warning">
              Page not found. Please use the navigation menu.
            </div>
          </Route>
        </Switch>
      </div>
    </>
  );
}
