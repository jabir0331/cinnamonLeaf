import { useState, useCallback, useEffect, useRef } from 'react';
import { CartItem } from '../types/cart';
import { loadCart, saveCart } from '../utils/cartStorage';

interface LiveMenuItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  status?: string;
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Persist the cart so it survives navigating to /login and back
  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  const cartItemsRef = useRef(cartItems);
  cartItemsRef.current = cartItems;

  // Reconciles a saved cart with the live menu: drops items that were deleted
  // or disabled and refreshes name/price/image from the menu's current data.
  const syncWithMenu = useCallback((menuItems: LiveMenuItem[]) => {
    const menuById = new Map(menuItems.map(item => [item._id, item]));
    const removed: string[] = [];
    let priceChanged = false;
    const synced: CartItem[] = [];

    for (const cartItem of cartItemsRef.current) {
      const live = menuById.get(cartItem.id);
      if (!live || live.status === 'Unavailable') {
        removed.push(cartItem.name);
        continue;
      }
      if (live.price !== cartItem.price) priceChanged = true;
      synced.push({ ...cartItem, name: live.name, price: live.price, image: live.image });
    }

    if (removed.length > 0 || priceChanged) {
      setCartItems(synced);
    }
    return { removed, priceChanged };
  }, []);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // Remove toast from here - let the calling component handle it
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // Remove toast from here - let the calling component handle it
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems(prevItems => {
      // Remove toast from here - let the calling component handle it if needed
      return prevItems.filter(cartItem => cartItem.id !== itemId);
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(cartItem =>
        cartItem.id === itemId
          ? { ...cartItem, quantity }
          : cartItem
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    // Remove toast from here - let the calling component handle it if needed
  }, []);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  return {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    syncWithMenu
  };
};