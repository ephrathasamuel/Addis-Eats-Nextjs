"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { placeOrder } from "@/app/actions";
import { useCart } from "@/components/Providers";
import { getDishByIdSync, getDishByNameSync } from "@/lib/dishes";

export const ADDIS_LOCATIONS = [
  { id: "bole", name: "Bole", fee: 50, drivingTime: "20 - 30 Mins" },
  { id: "kazanchis", name: "Kazanchis", fee: 40, drivingTime: "15 - 25 Mins" },
  { id: "sarbet", name: "Sarbet", fee: 50, drivingTime: "20 - 30 Mins" },
  { id: "piassa", name: "Piassa", fee: 60, drivingTime: "25 - 35 Mins" },
  { id: "cmc", name: "CMC", fee: 80, drivingTime: "35 - 45 Mins" },
  { id: "mexico", name: "Mexico / Lideta", fee: 45, drivingTime: "20 - 30 Mins" },
  { id: "4kilo", name: "4 Kilo", fee: 50, drivingTime: "20 - 30 Mins" },
  { id: "ayat", name: "Ayat", fee: 90, drivingTime: "40 - 50 Mins" },
];

export default function CheckoutView({
  itemsRaw = "[]",
  items = [],
  initialName = "",
  initialPhone = "",
  initialLocation = "Bole",
  fieldErrors = {},
  returning = false,
}) {
  const { clearCart } = useCart();
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [errors, setErrors] = useState(fieldErrors);
  const [isPending, startTransition] = useTransition();

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const locationObj =
    ADDIS_LOCATIONS.find((loc) => loc.name === selectedLocation) || ADDIS_LOCATIONS[0];
  const deliveryFee = items.length > 0 ? (subtotal > 600 ? 0 : locationObj.fee) : 0;
  const estimatedTime = locationObj.drivingTime;
  const grandTotal = subtotal + deliveryFee;

  function validatePhone(value) {
    const cleaned = value.replace(/[\s-]/g, "");
    if (!cleaned) {
      return "Phone number is required";
    }
    const etPhoneRegex = /^(?:\+251|0)[97]\d{8}$/;
    if (!etPhoneRegex.test(cleaned)) {
      return "Enter a valid Ethiopian phone number (e.g. 0912345678 or 0712345678)";
    }
    return null;
  }

  function handlePhoneBlur() {
    const err = validatePhone(phone);
    setErrors((prev) => ({
      ...prev,
      phone: err,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (isPending) return;

    const phoneErr = validatePhone(phone);
    if (!name.trim()) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
      return;
    }
    if (phoneErr) {
      setErrors((prev) => ({ ...prev, phone: phoneErr }));
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      localStorage.removeItem("addis-eats-cart");
      localStorage.removeItem("cart");
      clearCart();
    } catch {}

    startTransition(async () => {
      try {
        await placeOrder(formData);
      } catch (err) {
        if (err?.message?.includes("NEXT_REDIRECT")) {
          throw err;
        }
      }
    });
  }

  return (
    <div className="checkout-layout">
      <div className="checkout-header-banner">
        <div>
          <h1 className="checkout-title">Order Checkout</h1>
          <p className="checkout-subtitle">
            Review your selected dishes | Enter delivery address | Pay via TeleBirr or Cash
          </p>
        </div>
        {returning && (
          <div className="returning-badge">
            <span>Verified Customer : Last order on file</span>
          </div>
        )}
      </div>

      {items.length === 0 && !fieldErrors.items ? (
        <div className="checkout-empty-state">
          <div className="empty-state-svg" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>
          <h2>Your cart is empty</h2>
          <p>Explore our Traditional Ethiopian stews or Western favorites to get started.</p>
          <Link href="/menu" className="btn-primary" style={{ marginTop: "1rem", display: "inline-block" }}>
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="checkout-grid">
          {/* Left Column: Order Items & Visual Table */}
          <section className="checkout-card" aria-labelledby="order-summary-heading">
            <div className="checkout-card__header">
              <h2 id="order-summary-heading">Selected Dishes ({items.reduce((acc, i) => acc + i.qty, 0)})</h2>
              <Link href="/cart" className="checkout-edit-link">
                Edit Cart
              </Link>
            </div>

            <div className="checkout-dish-list">
              {items.map((item) => {
                const dish = getDishByIdSync(item.id) || getDishByNameSync(item.name);
                const imageUrl = item.image || dish?.image || "/images/food/doro-wat.jpg";
                const category = item.category || dish?.category;

                return (
                  <article key={item.id} className="checkout-dish-card">
                    <div className="checkout-dish-media">
                      <div className="checkout-dish-thumb-wrap">
                        <Image
                          src={imageUrl}
                          alt={item.name}
                          width={92}
                          height={92}
                          className="checkout-dish-thumb"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div className="checkout-dish-info">
                        <h3 className="checkout-dish-name">{item.name}</h3>
                        {category && (
                          <span className="checkout-dish-category-chip">{category}</span>
                        )}
                      </div>
                    </div>

                    <div className="checkout-numbers-table" role="table" aria-label={`Pricing for ${item.name}`}>
                      <div className="num-pill" role="cell">
                        <span className="num-pill__label">Quantity</span>
                        <span className="num-pill__val">{item.qty}</span>
                      </div>
                      <div className="num-pill" role="cell">
                        <span className="num-pill__label">Unit Price</span>
                        <span className="num-pill__val">{item.price} ETB</span>
                      </div>
                      <div className="num-pill num-pill--total" role="cell">
                        <span className="num-pill__label">Item Total</span>
                        <span className="num-pill__val">{item.price * item.qty} ETB</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Price Calculations Table */}
            <div className="checkout-breakdown">
              <div className="breakdown-row">
                <span>Items Subtotal</span>
                <span>{subtotal} ETB</span>
              </div>
              <div className="breakdown-row">
                <span>Delivery Location</span>
                <span style={{ fontWeight: "600", color: "var(--text)" }}>{locationObj.name}</span>
              </div>
              <div className="breakdown-row breakdown-row--multiline">
                <div className="breakdown-label">
                  <span>Standard Delivery</span>
                  <small className="breakdown-sub">(Addis Ababa)</small>
                </div>
                <div className="breakdown-val">
                  {deliveryFee === 0 ? (
                    <>
                      <span>FREE</span>
                      <small className="breakdown-sub">(Orders &gt; 600 ETB)</small>
                    </>
                  ) : (
                    <span>{deliveryFee} ETB</span>
                  )}
                </div>
              </div>
              <div className="breakdown-row">
                <span>Estimated Arrival</span>
                <span>{estimatedTime}</span>
              </div>
              <p style={{ margin: "0.2rem 0 0.85rem", color: "var(--muted)", fontSize: "0.82rem", lineHeight: 1.4 }}>
                Delivery time only accounts for driving time and does not include kitchen cooking time.
              </p>
              <div className="breakdown-row breakdown-row--grand">
                <span className="grand-label">Total Amount Due</span>
                <span className="grand-total-val">{grandTotal} ETB</span>
              </div>
            </div>
            {fieldErrors.items && <p className="field-error">{fieldErrors.items}</p>}
          </section>

          {/* Right Column: Customer Details Form */}
          <section className="checkout-card" aria-labelledby="delivery-details-heading">
            <div className="checkout-card__header">
              <h2 id="delivery-details-heading">Delivery Details</h2>
            </div>

            <form onSubmit={handleSubmit} noValidate className="order-form">
              <input type="hidden" name="items" value={itemsRaw} />
              <input type="hidden" name="location" value={locationObj.name} />
              <input type="hidden" name="deliveryFee" value={deliveryFee} />

              <div className="field">
                <label htmlFor="location-select">Choose Delivery Location</label>
                <select
                  id="location-select"
                  name="location_select"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="location-select"
                >
                  {ADDIS_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name} - {loc.fee} ETB ({loc.drivingTime})
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Estimate Info Card showing price, location, and time to deliver */}
              <div className="location-estimate-card">
                <div className="location-estimate-grid">
                  <div className="location-estimate-item">
                    <span className="location-estimate-label">Location</span>
                    <strong className="location-estimate-val">{locationObj.name}</strong>
                  </div>
                  <div className="location-estimate-item">
                    <span className="location-estimate-label">Delivery Price</span>
                    <strong className="location-estimate-val">
                      {deliveryFee === 0 ? "FREE" : `${deliveryFee} ETB`}
                    </strong>
                  </div>
                  <div className="location-estimate-item">
                    <span className="location-estimate-label">Estimated Driving Time</span>
                    <strong className="location-estimate-val">{estimatedTime}</strong>
                  </div>
                </div>
                <p className="location-estimate-note">
                  Delivery time only accounts for driving time and does not include kitchen cooking time.
                </p>
              </div>

              <div className="field">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                  }}
                  placeholder="Betelhem Abebe"
                  required
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="field-error" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="field">
                <label htmlFor="phone">Phone (TeleBirr / Mobile)</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
                  }}
                  onBlur={handlePhoneBlur}
                  placeholder="0912345678"
                  required
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className="field-error" role="alert">
                    {errors.phone}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="primary btn-block checkout-submit-btn"
                aria-busy={isPending}
              >
                {isPending ? "Placing..." : "Place order"}
              </button>
            </form>

            <div className="payment-options-note">
              <h4>Accepted Payment Methods</h4>
              <p>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "inline-block", verticalAlign: "middle", marginRight: "0.4rem" }}>
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
                TeleBirr | CBE Birr | Cash on Delivery (COD)
              </p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
