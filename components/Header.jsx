"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthStatus } from "@/components/AuthStatus";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useCart } from "@/components/Providers";

export function Header() {
  const pathname = usePathname();
  const cart = useCart();
  const cartCount = cart?.hydrated && Array.isArray(cart.items)
    ? cart.items.reduce((sum, item) => sum + (item.qty || 0), 0)
    : 0;

  const isActive = (path) => {
    if (!pathname) return false;
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Link href="/" className="brand" aria-label="Addis Eats Traditional & Western">
            <span className="brand-logo-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
              </svg>
            </span>
            <span className="brand-text">
              <span className="brand-name">Addis Eats</span>
              <span className="brand-sub">Traditional & Western</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Main Navigation" className="site-header__nav">
            <Link href="/menu" className={`nav-link ${isActive("/menu") ? "nav-link--active" : ""}`}>Menu</Link>
            <Link href="/orders" className={`nav-link ${isActive("/orders") ? "nav-link--active" : ""}`}>Orders</Link>
            <Link href="/favorites" className={`nav-link ${isActive("/favorites") ? "nav-link--active" : ""}`}>Favorites</Link>
            <Link href="/cart" className={`nav-link nav-link--cart ${isActive("/cart") ? "nav-link--active" : ""}`}>
              <span>Cart</span>
              <span className="nav-cart-indicator">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </span>
              {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
            </Link>
          </nav>

          <div className="site-header__actions">
            <ThemeToggle />
            <AuthStatus />
          </div>
        </div>
      </header>

      {/* Mobile Persistent Bottom Tab Bar */}
      <nav aria-label="Mobile Navigation" className="mobile-bottom-nav">
        <Link
          href="/menu"
          className={`mobile-nav-item ${isActive("/menu") ? "mobile-nav-item--active" : ""}`}
        >
          <span className="mobile-nav-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
              <path d="M7 2v20" />
              <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
            </svg>
          </span>
          <span className="mobile-nav-label">Menu</span>
        </Link>

        <Link
          href="/orders"
          className={`mobile-nav-item ${isActive("/orders") ? "mobile-nav-item--active" : ""}`}
        >
          <span className="mobile-nav-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </span>
          <span className="mobile-nav-label">Orders</span>
        </Link>

        <Link
          href="/favorites"
          className={`mobile-nav-item ${isActive("/favorites") ? "mobile-nav-item--active" : ""}`}
        >
          <span className="mobile-nav-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </span>
          <span className="mobile-nav-label">Favorites</span>
        </Link>

        <Link
          href="/cart"
          className={`mobile-nav-item ${isActive("/cart") ? "mobile-nav-item--active" : ""}`}
        >
          <span className="mobile-nav-icon mobile-nav-icon--cart" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && <span className="mobile-cart-badge">{cartCount}</span>}
          </span>
          <span className="mobile-nav-label">Cart</span>
        </Link>
      </nav>
    </>
  );
}

export default Header;
