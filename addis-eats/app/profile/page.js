import { getDishByIdSync, getDishByNameSync } from "@/lib/dishes";
import Link from "next/link";
import { cookies } from "next/headers";
import { getOrdersByOwner } from "@/lib/orders";
import { signOut } from "@/app/actions";
import { ProfileCartPreview } from "@/components/ProfileCartPreview";


export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const name = cookieStore.get("user_name")?.value
    ? decodeURIComponent(cookieStore.get("user_name").value)
    : null;
  const email = cookieStore.get("user_email")?.value
    ? decodeURIComponent(cookieStore.get("user_email").value)
    : null;
  const ownerToken = cookieStore.get("order_owner")?.value;

  if (!session) {
    return (
      <div className="empty-state">
        <h1>Profile</h1>
        <p>Sign in to see your cart and order history.</p>
        <Link href="/signin?next=/profile" className="btn-primary">
          Sign in
        </Link>
      </div>
    );
  }

  const orders = getOrdersByOwner(ownerToken);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div>
          <h1>{name || "Your profile"}</h1>
          {email && <p className="empty">{email}</p>}
        </div>
        <form action={signOut}>
          <button type="submit" className="btn-ghost">
            Sign out
          </button>
        </form>
      </div>

      <section className="profile-section">
        <h2>Your cart</h2>
        <ProfileCartPreview />
      </section>

      <section className="profile-section">
        <h2>Order history</h2>
        {orders.length === 0 ? (
          <p className="empty">
            No orders yet. Orders you place at{" "}
            <Link href="/checkout">checkout</Link> will show up here.
          </p>
        ) : (
          <div className="order-list">
            {orders.map((order) => (
              <div className="order-card" key={order.id}>
                <div className="order-card__row">
                  <strong>Order #{order.id}</strong>
                  <span className={`order-status order-status--${order.status}`}>
                    {order.status}
                  </span>
                </div>
                <p className="empty">
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <div className="profile-cart-list">
                  {order.items.map((item, idx) => {
                    const dish = getDishByIdSync(item.id) || getDishByNameSync(item.name);
                    const imgSrc = item.image || dish?.image || "/images/food/doro-wat.jpg";
                    return (
                      <div className="order-item-card" key={idx}>
                        <div className="order-item-media">
                          <div className="order-item-frame">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={imgSrc} alt={item.name} className="order-item-thumb" />
                          </div>
                          <span className="order-item-name">{item.name}</span>
                        </div>

                        <div className="order-item-tables">
                          <div className="num-pill" role="cell">
                            <span className="num-pill__label">Qty</span>
                            <span className="num-pill__val">{item.qty}</span>
                          </div>
                          <div className="num-pill num-pill--total" role="cell">
                            <span className="num-pill__label">Total</span>
                            <span className="num-pill__val">{item.price * item.qty} ETB</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="total-row">
                  <span>Total</span>
                  <span>{order.total} ETB</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
