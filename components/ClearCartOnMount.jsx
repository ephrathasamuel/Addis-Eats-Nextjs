"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/components/Providers";

export function ClearCartOnMount() {
  const { clearCart, items } = useCart();
  const clearedRef = useRef(false);

  useEffect(() => {
    if (clearedRef.current) return;
    clearedRef.current = true;

    try {
      localStorage.removeItem("addis-eats-cart");
      localStorage.removeItem("cart");
    } catch {}

    if (items && items.length > 0) {
      clearCart();
    }
  }, [clearCart, items]);

  return null;
}

export default ClearCartOnMount;
