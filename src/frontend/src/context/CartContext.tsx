import type { CartItem, CartState, Product } from "@/types";
import React, { createContext, useContext, useReducer, useEffect } from "react";

interface CartContextValue extends CartState {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product; quantity: number }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; items: CartItem[] };

function calcTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
}

function calcCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.product.id === action.product.id,
      );
      const items = existing
        ? state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + action.quantity }
              : i,
          )
        : [
            ...state.items,
            { product: action.product, quantity: action.quantity },
          ];
      return { items, total: calcTotal(items), itemCount: calcCount(items) };
    }
    case "REMOVE_ITEM": {
      const items = state.items.filter(
        (i) => i.product.id !== action.productId,
      );
      return { items, total: calcTotal(items), itemCount: calcCount(items) };
    }
    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        const items = state.items.filter(
          (i) => i.product.id !== action.productId,
        );
        return { items, total: calcTotal(items), itemCount: calcCount(items) };
      }
      const items = state.items.map((i) =>
        i.product.id === action.productId
          ? { ...i, quantity: action.quantity }
          : i,
      );
      return { items, total: calcTotal(items), itemCount: calcCount(items) };
    }
    case "CLEAR_CART":
      return { items: [], total: 0, itemCount: 0 };
    case "HYDRATE": {
      const items = action.items;
      return { items, total: calcTotal(items), itemCount: calcCount(items) };
    }
    default:
      return state;
  }
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "hackers-pendrive-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored) as CartItem[];
        dispatch({ type: "HYDRATE", items });
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // ignore storage errors
    }
  }, [state.items]);

  const addItem = (product: Product, quantity = 1) =>
    dispatch({ type: "ADD_ITEM", product, quantity });
  const removeItem = (productId: string) =>
    dispatch({ type: "REMOVE_ITEM", productId });
  const updateQuantity = (productId: string, quantity: number) =>
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((o) => !o);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
