import { CartItem } from '../types/cart';

const CART_STORAGE_KEY = 'cart';

const isCartItem = (value: any): value is CartItem =>
  value &&
  typeof value.id === 'string' &&
  typeof value.name === 'string' &&
  typeof value.price === 'number' &&
  Number.isInteger(value.quantity) &&
  value.quantity > 0;

export const loadCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    return [];
  }
};

export const saveCart = (items: CartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage unavailable (private mode, quota) - the cart just won't persist
  }
};

export const clearStoredCart = (): void => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch {
    // ignore
  }
};
