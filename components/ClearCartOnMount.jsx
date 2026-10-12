"use client";

import { useEffect } from "react";
import { useCart } from "@/components/Providers";

export function ClearCartOnMount() {
  const { clearCart } = useCart();

  useEffect(() => {
    try {
      localStorage.removeItem("addis-eats-cart");
      localStorage.removeItem("cart");
      clearCart();
      window.dispatchEvent(new Event("cart-updated"));
    } catch {}
  }, [clearCart]);

  return null;
}

export default ClearCartOnMount;
