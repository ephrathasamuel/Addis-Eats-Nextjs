"use client";

import { useEffect } from "react";

export function ClearCartOnMount() {
  useEffect(() => {
    try {
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cart-updated"));
    } catch {}
  }, []);

  return null;
}

export default ClearCartOnMount;
