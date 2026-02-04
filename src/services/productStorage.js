const PRODUCTS_KEY = "petcare_products";

export function getStoredProducts() {
  return JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
}

export function saveStoredProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function hasStoredProducts() {
  return localStorage.getItem(PRODUCTS_KEY) !== null;
}
