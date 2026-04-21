"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import { getFromStorage, removeFromStorage, setToStorage } from "@/utils/storage";

const CART_STORAGE_KEY = "revalsys_cart_v1";

type CartState = {
  items: CartItem[];
  hydrated: boolean;
};

type CartAction =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "add"; product: Product; quantity: number }
  | { type: "remove"; productId: string }
  | { type: "setQuantity"; productId: string; quantity: number }
  | { type: "clear" };

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim().length) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function sanitizeCartItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  const items: CartItem[] = [];

  for (const it of value) {
    if (!it || typeof it !== "object") continue;
    const candidate = it as { product?: unknown; quantity?: unknown };
    const productRaw = candidate.product;
    if (!productRaw || typeof productRaw !== "object") continue;
    const product = productRaw as Partial<Product>;

    if (typeof product.id !== "string") continue;
    if (typeof product.name !== "string") continue;
    if (typeof product.category !== "string") continue;
    if (typeof product.image !== "string") continue;
    if (typeof product.description !== "string") continue;

    const price = toNumber(product.price);
    if (price === null) continue;

    const qty = Math.max(0, Math.floor(toNumber(candidate.quantity) ?? 0));
    if (qty <= 0) continue;

    items.push({
      product: {
        id: product.id,
        name: product.name,
        price,
        category: product.category,
        image: product.image,
        description: product.description,
      },
      quantity: qty,
    });
  }

  return items;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate": {
      // Don't overwrite if user already added items before hydration.
      if (state.hydrated) return state;
      if (state.items.length > 0) return { ...state, hydrated: true };
      return { items: action.items, hydrated: true };
    }
    case "add": {
      const quantityToAdd = Math.max(1, Math.floor(action.quantity));
      const existingIndex = state.items.findIndex(
        (it) => it.product.id === action.product.id
      );
      if (existingIndex === -1) {
        return {
          ...state,
          items: [
            ...state.items,
            { product: action.product, quantity: quantityToAdd },
          ],
        };
      }
      const next = state.items.slice();
      next[existingIndex] = {
        ...next[existingIndex],
        quantity: next[existingIndex].quantity + quantityToAdd,
      };
      return { ...state, items: next };
    }
    case "remove": {
      return {
        ...state,
        items: state.items.filter((it) => it.product.id !== action.productId),
      };
    }
    case "setQuantity": {
      const nextQty = Math.max(0, Math.floor(action.quantity));
      if (nextQty === 0) {
        return {
          ...state,
          items: state.items.filter((it) => it.product.id !== action.productId),
        };
      }
      return {
        ...state,
        items: state.items.map((it) =>
          it.product.id === action.productId ? { ...it, quantity: nextQty } : it
        ),
      };
    }
    case "clear": {
      return { ...state, items: [] };
    }
    default: {
      return state;
    }
  }
}

type CartContextValue = {
  items: CartItem[];
  hydrated: boolean;
  totalItems: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  increase: (productId: string) => void;
  decrease: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    hydrated: false,
  });

  useEffect(() => {
    const stored = sanitizeCartItems(
      getFromStorage<unknown>(CART_STORAGE_KEY, [])
    );
    dispatch({ type: "hydrate", items: stored });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    if (state.items.length === 0) {
      removeFromStorage(CART_STORAGE_KEY);
      return;
    }
    setToStorage(CART_STORAGE_KEY, state.items);
  }, [state.hydrated, state.items]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    dispatch({ type: "add", product, quantity });
  }, []);

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: "remove", productId });
  }, []);

  const increase = useCallback(
    (productId: string) => {
      const existing = state.items.find((it) => it.product.id === productId);
      const nextQuantity = (existing?.quantity ?? 0) + 1;
      dispatch({ type: "setQuantity", productId, quantity: nextQuantity });
    },
    [state.items]
  );

  const decrease = useCallback(
    (productId: string) => {
      const existing = state.items.find((it) => it.product.id === productId);
      const nextQuantity = (existing?.quantity ?? 0) - 1;
      dispatch({ type: "setQuantity", productId, quantity: nextQuantity });
    },
    [state.items]
  );

  const clearCart = useCallback(() => {
    dispatch({ type: "clear" });
  }, []);

  const totalItems = useMemo(
    () => state.items.reduce((sum, it) => sum + it.quantity, 0),
    [state.items]
  );

  const subtotal = useMemo(
    () => state.items.reduce((sum, it) => sum + it.product.price * it.quantity, 0),
    [state.items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      hydrated: state.hydrated,
      totalItems,
      subtotal,
      addItem,
      removeItem,
      increase,
      decrease,
      clearCart,
    }),
    [
      addItem,
      clearCart,
      decrease,
      increase,
      removeItem,
      state.hydrated,
      state.items,
      subtotal,
      totalItems,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

