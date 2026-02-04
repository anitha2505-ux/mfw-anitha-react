import React, { useEffect } from "react";
import { Route, Switch } from "wouter";
import { useSetAtom } from "jotai";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import Subscribe from "./pages/Subscribe";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";

import { fetchProducts } from "./services/productApi";
import { getStoredProducts, hasStoredProducts, saveStoredProducts } from "./services/productStorage";
import { productsAtom } from "./store/atoms";

export default function App() {
  const setProducts = useSetAtom(productsAtom);

  // Init products once: localStorage first, else JSON, then persist.
  useEffect(() => {
    async function initProducts() {
      if (hasStoredProducts()) {
        setProducts(getStoredProducts());
        return;
      }
      const jsonProducts = await fetchProducts();
      setProducts(jsonProducts);
      saveStoredProducts(jsonProducts);
    }
    initProducts();
  }, [setProducts]);

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <Switch>
          {/* Public */}
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/products/:id">
            {(params) => <ProductDetails id={params.id} />}
          </Route>
          <Route path="/cart" component={Cart} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/confirmation" component={Confirmation} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/subscribe" component={Subscribe} />

          {/* Admin */}
          <ProtectedRoute path="/admin" component={AdminDashboard} requireRole="admin" />
          <ProtectedRoute path="/admin/products" component={AdminProducts} requireRole="admin" />

          {/* Fallback */}
          <Route>
            <div className="alert alert-warning">Page not found. Please use the navigation menu.</div>
          </Route>
          
        </Switch>
      </div>
    </>
  );
}
