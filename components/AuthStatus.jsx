"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function AuthStatus() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    // 1. Instant check from user_name cookie if present
    const nameMatch = document.cookie.match(/(?:^|; )user_name=([^;]*)/);
    const initialName = nameMatch ? decodeURIComponent(nameMatch[1]) : null;
    if (initialName) {
      setUser({ name: initialName });
    }

    // 2. Query /api/auth/me to verify real session status across all page loads
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data?.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        if (!initialName) {
          setUser(null);
        }
      });
  }, []);

  if (user === undefined) {
    return <span className="auth-status auth-status--placeholder" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <Link href="/signin" className="btn-ghost">
        Sign in
      </Link>
    );
  }

  return (
    <Link href="/profile" className="btn-ghost" title={user.name}>
      Hi, {user.name.split(" ")[0]}
    </Link>
  );
}

export default AuthStatus;
