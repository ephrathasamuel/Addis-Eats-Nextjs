"use client";

import { useState } from "react";
import { useCart } from "@/components/Providers";

export function AddToCartButton({ dish, size = "default" }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleClick(e) {
    // DishCard wraps this in a Link (photo/title go to the dish page) -
    // stop the click from also triggering that navigation.
    e.preventDefault();
    e.stopPropagation();
    addItem(dish);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <button
      type="button"
      className={`add-to-cart ${size === "compact" ? "add-to-cart--compact" : ""}`}
      onClick={handleClick}
    >
      {justAdded ? "Added" : "Add to cart"}
    </button>
  );
}
