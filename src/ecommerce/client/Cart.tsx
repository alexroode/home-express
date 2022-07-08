import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useShoppingCart } from "use-shopping-cart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons/faTimesCircle";
import ErrorMessage from "./ErrorMessage";

const el = document.getElementById("cart-contents");
const Cart: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const cart = useShoppingCart();
  const { cartDetails, removeItem, formattedTotalPrice, cartCount, redirectToCheckout } = cart;

  const cartItems = Object.values(cartDetails ?? {}).map((item) => (
    <div key={item.id} className="d-flex align-items-center position-relative py-2">
      <button className="btn btn-link link-danger font-125 position-absolute remove-button" onClick={() => removeItem(item.id)}>
        <FontAwesomeIcon icon={faTimesCircle} />
      </button>
      <div className="d-sm-flex ml-5 py-2 flex-grow-1">
        <div className="flex-grow-1">{item.name}</div>
        <div className="font-weight-bold">{item.formattedValue}</div>
      </div>
    </div>
  ));

  function proceedToCheckout() {
    setError(null);
    setSubmitting(true);
    return fetch("/api/session", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cartDetails)
    })
      .then(response => response.json())
      .then(response => {
        setSubmitting(false);
        return redirectToCheckout(response.sessionId);
      })
      .catch((error) => setError(error))
      .finally(() => setSubmitting(false));
  }

  return ReactDOM.createPortal(
    <div>
      {cartItems.length > 0 ? (
        <div>
          {cartItems}
          <div className="d-flex">
            <div className="d-sm-flex ml-5 pt-4 flex-grow-1">
              <div className="flex-grow-1">Total</div>
              <div className="font-weight-bold">{formattedTotalPrice}</div>
            </div>
          </div>
          <div className="mt-s2">
            {cartCount > 0 && !error ? <button className="btn btn-primary w-100 w-sm-auto" disabled={submitting}
              onClick={() => proceedToCheckout()}>Proceed to Checkout</button> : null}
            {error ? <ErrorMessage error={error} onRetry={() => proceedToCheckout()}/> : null}
          </div>
        </div>
      ): <p>Your cart is empty.</p>}

    </div>,
    el
  );
};

export default Cart;