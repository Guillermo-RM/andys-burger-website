"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type CartState = Record<string, number>;

type OrderCartContextValue = {
  cart: CartState;
  setQuantity: (id: string, quantity: number) => void;
  toggleProduct: (id: string, checked: boolean) => void;
};

const CART_STORAGE_KEY = "andys-burger-order-cart";
const OrderCartContext = createContext<OrderCartContextValue | null>(null);

function readStoredCart(): CartState {
  try {
    const storedValue = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!storedValue) return {};

    const parsedValue: unknown = JSON.parse(storedValue);
    if (!parsedValue || typeof parsedValue !== "object" || Array.isArray(parsedValue)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsedValue).filter(
        ([id, quantity]) =>
          id.length > 0 &&
          typeof quantity === "number" &&
          Number.isFinite(quantity) &&
          quantity > 0,
      ).map(([id, quantity]) => [id, Math.floor(quantity as number)]),
    );
  } catch {
    return {};
  }
}

export function OrderCartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>({});
  const [storageLoaded, setStorageLoaded] = useState(false);

  useEffect(() => {
    setCart(readStoredCart());
    setStorageLoaded(true);
  }, []);

  useEffect(() => {
    if (!storageLoaded) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart, storageLoaded]);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setCart((current) => {
      const next = { ...current };
      const normalizedQuantity = Math.max(0, Math.floor(quantity));

      if (normalizedQuantity === 0) delete next[id];
      else next[id] = normalizedQuantity;

      return next;
    });
  }, []);

  const toggleProduct = useCallback((id: string, checked: boolean) => {
    setCart((current) => {
      const next = { ...current };

      if (checked) next[id] = Math.max(current[id] ?? 0, 1);
      else delete next[id];

      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ cart, setQuantity, toggleProduct }),
    [cart, setQuantity, toggleProduct],
  );

  return (
    <OrderCartContext.Provider value={value}>
      {children}
    </OrderCartContext.Provider>
  );
}

export function useOrderCart() {
  const context = useContext(OrderCartContext);

  if (!context) {
    throw new Error("useOrderCart debe utilizarse dentro de OrderCartProvider.");
  }

  return context;
}
