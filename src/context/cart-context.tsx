"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CakeCardItem, CartItem } from "@/types/store";

type CartContextValue = {
  items: CartItem[];
  isHydrated: boolean;
  totalCount: number;
  totalAmount: number;
  addToCart: (cake: CakeCardItem) => void;
  removeFromCart: (cakeId: number) => void;
  updateQuantity: (cakeId: number, quantity: number) => void;
  clearCart: () => void;
};

const CART_STORAGE_KEY = "cake-shop-cart-v1";

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      setItems([]);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const addToCart = (cake: CakeCardItem) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.cakeId === cake.id);
      if (!existing) {
        return [
          ...prev,
          {
            cakeId: cake.id,
            name: cake.name,
            imageUrl: cake.imageUrl,
            price: cake.price,
            weightGrams: cake.weightGrams,
            quantity: 1,
          },
        ];
      }

      return prev.map((item) =>
        item.cakeId === cake.id
          ? { ...item, quantity: Math.min(item.quantity + 1, 20) }
          : item,
      );
    });
  };

  const removeFromCart = (cakeId: number) => {
    setItems((prev) => prev.filter((item) => item.cakeId !== cakeId));
  };

  const updateQuantity = (cakeId: number, quantity: number) => {
    const normalizedQuantity = Math.max(0, Math.min(20, quantity));

    if (normalizedQuantity === 0) {
      removeFromCart(cakeId);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.cakeId === cakeId ? { ...item, quantity: normalizedQuantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isHydrated,
        totalCount,
        totalAmount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}

