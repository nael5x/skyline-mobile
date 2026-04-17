import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

import { Product } from "@/constants/data";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  totalCount: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType>({
  items: [],
  totalCount: 0,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  isInCart: () => false,
});

const CART_STORAGE_KEY = "skyline_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(CART_STORAGE_KEY).then((data) => {
      if (data) {
        try {
          setItems(JSON.parse(data));
        } catch {}
      }
    });
  }, []);

  const persist = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
  }, []);

  const addItem = useCallback(
    (product: Product) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.product.id === product.id);
        let next: CartItem[];
        if (existing) {
          next = prev.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
          );
        } else {
          next = [...prev, { product, quantity: 1 }];
        }
        AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const removeItem = useCallback(
    (productId: string) => {
      const next = items.filter((i) => i.product.id !== productId);
      persist(next);
    },
    [items, persist],
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }
      const next = items.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i,
      );
      persist(next);
    },
    [items, persist, removeItem],
  );

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const isInCart = useCallback(
    (productId: string) => items.some((i) => i.product.id === productId),
    [items],
  );

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, totalCount, addItem, removeItem, updateQuantity, clearCart, isInCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
