"use client";

import { useState } from "react";
import { placeOrder } from "@/app/actions";
import { useCart } from "@/components/Providers";

export default function OrderForm({ itemsRaw, initialName = "", initialPhone = "", fieldErrors = {} }) {
  const { clearCart } = useCart();
  const [name, setName] = useState(initialName || "");
  const [phone, setPhone] = useState(initialPhone || "");
  const [errors, setErrors] = useState(fieldErrors);
  const [pending, setPending] = useState(false);

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
    if (pending) {
      e.preventDefault();
      return;
    }

    const phoneErr = validatePhone(phone);
    if (!name.trim()) {
      e.preventDefault();
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
      return;
    }
    if (phoneErr) {
      e.preventDefault();
      setErrors((prev) => ({ ...prev, phone: phoneErr }));
      return;
    }

    try {
      localStorage.removeItem("addis-eats-cart");
      localStorage.removeItem("cart");
      clearCart();
    } catch {}

    setPending(true);
  }

  return (
    <form action={placeOrder} onSubmit={handleSubmit} noValidate className="order-form">
      <input type="hidden" name="items" value={itemsRaw} />

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
        disabled={pending}
        className="primary btn-block checkout-submit-btn"
        aria-busy={pending}
      >
        {pending ? "Placing..." : "Place order"}
      </button>
    </form>
  );
}
