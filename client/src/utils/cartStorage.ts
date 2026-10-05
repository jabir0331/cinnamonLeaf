import { CartItem } from '../types/cart';

const CART_STORAGE_KEY = 'cart';

const isCartItem = (value: unknown): value is CartItem => {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.price === 'number' &&
    typeof item.quantity === 'number' &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
};

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
