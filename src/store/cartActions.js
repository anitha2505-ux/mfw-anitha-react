import { useAtom } from "jotai";
import { cartAtom } from "./atoms";

export function useCartActions() {
  const [cart, setCart] = useAtom(cartAtom);

  function addToCart(product, qty = 1) {
    if (!product) return;
    const safeQty = Number.isFinite(qty) && qty > 0 ? qty : 1;

    setCart((prev) => {
      const existing = prev.find((x) => x.productId === product.id);
      if (existing) {
        return prev.map((x) =>
          x.productId === product.id ? { ...x, qty: x.qty + safeQty } : x
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          qty: safeQty,
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

  const cartCount = cart.reduce((n, i) => n + Number(i.qty || 0), 0);

  return { cart, setCart, addToCart, updateQty, removeFromCart, clearCart, cartCount };
}
