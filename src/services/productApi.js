import axios from "axios";

export async function fetchProducts() {
  const response = await axios.get("/json/products.json");
  return response.data;
}