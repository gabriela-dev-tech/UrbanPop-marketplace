import { useState } from "react";
import { Link } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/useCart";
import { apiRequest } from "../services/api";
import "./CartPage.css";

function formatPrice(amount) {
  return `$${Number(amount).toFixed(2)}`;
}

function CartPage() {
  const {
    items,
    total,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [completedOrder, setCompletedOrder] = useState(null);
  const [quantityDrafts, setQuantityDrafts] = useState({});

  async function handleCheckout(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const order = {
      customer_name: formData.get("customer_name"),
      email: formData.get("email"),
      items: items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      const token = localStorage.getItem("urbanpop-token");
      const headers = token
        ? { Authorization: `Token ${token}` }
        : {};

      const data = await apiRequest("/api/orders/", {
        method: "POST",
        headers,
        body: JSON.stringify(order),
      });

      setCompletedOrder(data);
      clearCart();
    } catch (checkoutError) {
      setError(
        checkoutError.message === "Failed to fetch"
          ? "Could not reach Django. Make sure the backend server is running."
          : checkoutError.message ||
              "The order could not be placed. Check the products and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleQuantityChange(productId, value) {
    setQuantityDrafts((current) => ({
      ...current,
      [productId]: value,
    }));

    const quantity = Number(value);

    if (value !== "" && Number.isInteger(quantity) && quantity >= 1) {
      updateQuantity(productId, quantity);
    }
  }

  function finishQuantityEdit(productId) {
    const value = quantityDrafts[productId];
    const quantity = Number(value);

    if (value !== "" && Number.isInteger(quantity) && quantity >= 1) {
      updateQuantity(productId, quantity);
    }

    setQuantityDrafts((current) => {
      const next = { ...current };
      delete next[productId];
      return next;
    });
  }

  return (
    <div className="storefront cart-page-shell">
      <Header />

      <main className="cart-page">
        {completedOrder ? (
          <section className="cart-empty">
            <h1>Order received!</h1>
            <p>Your order number is #{completedOrder.id}.</p>
            <p>Total: {formatPrice(completedOrder.total)}</p>
            <Link className="cart-continue" to="/#shop">
              Continue shopping
            </Link>
          </section>
        ) : (
          <>
            <h1>Your Cart</h1>

            {items.length === 0 ? (
              <section className="cart-empty">
                <p>Your cart is empty for now.</p>
                <Link className="cart-continue" to="/#shop">
                  Continue shopping
                </Link>
              </section>
            ) : (
              <>
                <div className="cart-items">
                  {items.map((item) => (
                    <article className="cart-row" key={item.id}>
                      {item.image && (
                        <img src={item.image} alt={item.name} />
                      )}

                      <div className="cart-item-info">
                        <h2>{item.name}</h2>
                        <p>{formatPrice(item.price)} each</p>
                        <button
                          className="cart-remove"
                          type="button"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </button>
                      </div>

                      <label className="cart-quantity">
                        Quantity
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={
                            quantityDrafts[item.id] ??
                            String(item.quantity ?? 1)
                          }
                          onChange={(event) =>
                            handleQuantityChange(item.id, event.target.value)
                          }
                          onBlur={() => finishQuantityEdit(item.id)}
                        />
                      </label>

                      <strong className="cart-line-total">
                        {formatPrice(item.price * item.quantity)}
                      </strong>
                    </article>
                  ))}
                </div>

                <section className="cart-summary" aria-label="Order summary">
                  <p>
                    <span>Subtotal</span>
                    <strong>{formatPrice(total)}</strong>
                  </p>

                  <small>Demo checkout only—no payment is collected.</small>

                  <form className="checkout-form" onSubmit={handleCheckout}>
                    <h2>Checkout</h2>

                    <label>
                      Your name
                      <input
                        type="text"
                        name="customer_name"
                        required
                      />
                    </label>

                    <label>
                      Email
                      <input
                        type="email"
                        name="email"
                        required
                      />
                    </label>

                    {error && <p role="alert">{error}</p>}

                    <button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Placing order…" : "Place Demo Order"}
                    </button>
                  </form>

                  <Link className="cart-continue" to="/#shop">
                    Continue shopping
                  </Link>
                </section>
              </>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default CartPage;