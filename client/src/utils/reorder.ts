import type { CartItem } from '../types/cart';
import { loadCart, saveCart } from './cartStorage';

interface OrderedItem {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  image?: string;
}

// Adds the items of a past order to the saved cart (quantities add up when an item is already there).
// The menu page re-checks them against the live menu, so anything unavailable or repriced is handled there.
// Returns how many different items were added.
export const addOrderToCart = (items: OrderedItem[]): number => {
  const cart = loadCart();
  let added = 0;

  for (const item of items) {
    if (!item.id || !(item.quantity > 0)) continue;

    const existing = cart.find(cartItem => cartItem.id === item.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      const entry: CartItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image ?? '',
        quantity: item.quantity,
        category: item.category ?? '',
      };
      cart.push(entry);
    }
    added += 1;
  }

  if (added > 0) saveCart(cart);
  return added;
};
