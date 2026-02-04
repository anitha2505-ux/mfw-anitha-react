import { atom } from "jotai";

export const productsAtom = atom([]);
export const cartAtom = atom([]);      // [{ productId, name, price, qty, image }]
export const orderAtom = atom(null);   // order object after checkout
