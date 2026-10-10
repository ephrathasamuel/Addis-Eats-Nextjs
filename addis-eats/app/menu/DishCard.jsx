"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DishImage } from "@/components/DishImage";
import { FavoriteButton } from "@/components/FavoriteButton";
import { AddToCartButton } from "@/components/AddToCartButton";

export function DishCard({ dish }) {
  const router = useRouter();

  function handleCardKeyDown(e) {
    if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      router.push(`/menu/${dish.id}`);
    }
  }

  return (
    <article
      className="dish-card"
      tabIndex={0}
      role="region"
      aria-label={`${dish.name}, ${dish.category}`}
      onKeyDown={handleCardKeyDown}
    >
      <div className="dish-card__image-wrap">
        <Link
          href={`/menu/${dish.id}`}
          className="dish-card__image-link"
          tabIndex={-1}
          aria-hidden="true"
        >
          <DishImage dish={dish} size="card" />
        </Link>
        {dish.tag && <span className="dish-badge">{dish.tag}</span>}
        <FavoriteButton dish={dish} size="card" />
      </div>

      <div className="dish-card__body">
        <div className="dish-card__header">
          <span className="dish-category-pill">{dish.category}</span>
          {dish.spicy && <span className="dish-spicy-indicator" title="Spicy Berbere / Mitmita">Spicy</span>}
        </div>

        <h3 className="dish-title">
          <Link href={`/menu/${dish.id}`} className="dish-title-link">
            {dish.name}
          </Link>
        </h3>

        <p className="dish-description">{dish.description}</p>

        <div className="dish-card__footer">
          <div className="dish-price-wrap">
            <span className="dish-price-currency">ETB</span>
            <span className="dish-price-val">{dish.price}</span>
          </div>
          <AddToCartButton dish={dish} size="compact" />
        </div>
      </div>
    </article>
  );
}

export default DishCard;
