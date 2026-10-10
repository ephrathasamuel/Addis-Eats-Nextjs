"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Reads the non-httpOnly `user_name` cookie client-side to decide what to
// show. The real session token (`session`, set alongside it in the signIn
// action) stays httpOnly and is never touched here — this cookie exists
// purely so the UI can greet the visitor without a server round trip.
//
// Signing out lives on /profile, not here — "Hi, <name>" is a link there,
// where the visitor can also see their cart and order history before
// deciding to sign out.
//
// `undefined` (not yet checked) renders nothing, so the page never flashes
// "Sign in" for a split second before correcting itself to a name.
export function AuthStatus() {
  const [name, setName] = useState(undefined);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )user_name=([^;]*)/);
    setName(match ? decodeURIComponent(match[1]) : null);
  }, []);

  if (name === undefined) {
    return <span className="auth-status auth-status--placeholder" aria-hidden="true" />;
  }

  if (name === null) {
    return (
      <Link href="/signin" className="btn-ghost">
        Sign in
      </Link>
    );
  }

  return (
    <Link href="/profile" className="btn-ghost">
      Hi, {name.split(" ")[0]}
    </Link>
  );
}
