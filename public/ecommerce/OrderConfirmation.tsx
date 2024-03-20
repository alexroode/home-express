import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useShoppingCart } from "use-shopping-cart";
import LoadingIndicator from "./LoadingIndicator";
import { formatCurrencyString } from "use-shopping-cart";
import { OrderConfirmation } from "../../shared";
import ErrorMessage from "./ErrorMessage";

const el = document.getElementById("order-confirmation");

const OrderConfirmation = () => {
  const cart = useShoppingCart();
  const { clearCart } = cart;
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation>({ total: 0, items: []});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const errorMessage = "Sorry, there was an error loading your order confirmation. "
    + "Your order was still placed successfully. A receipt will be emailed to you.";

  async function loadSessionDetails() {
    try {
      const sessionId = (new URLSearchParams(window.location.search)).get("session_id");
      const response = await fetch("/api/order-confirmation?sessionId=" + sessionId);
      const details = await response.json();
      setOrderConfirmation(details);
    } catch(error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }

  function formatDate(timestamp: number): string {
    if (!timestamp) {
      return "";
    }
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  }

  useEffect(() => {
    clearCart();
  }, []);

  useEffect(() => {
    loadSessionDetails();
  }, []);

  return ReactDOM.createPortal(
    <div>
      {error ? <ErrorMessage error={error} errorMessage={errorMessage} onRetry={() => loadSessionDetails()}/> : <>
        {isLoading ? <LoadingIndicator /> : <>
          <div className="bg-primary text-white p-3 d-md-flex align-items-end mt-5">
            <h2 className="flex-grow-1 mb-0">Order Summary</h2>
            <p className="font-weight-bold mb-0">{formatDate(orderConfirmation.timestamp)}</p>
          </div>
          <div className="bg-gray-100 p-3 mb-5">
            {orderConfirmation.items.map(item =>
              <div key={item.id} className="d-flex align-items-center position-relative py-2">
                <div className="d-sm-flex flex-grow-1">
                  <div className="flex-grow-1">{item.description}</div>
                  <div className="font-weight-bold">{formatCurrencyString({ value: item.amount_subtotal, currency: item.price.currency })}</div>
                </div>
              </div>
            )}
            <div className="d-sm-flex flex-grow-1">
              <div className="flex-grow-1">Total</div>
              <div className="font-weight-bold">{formatCurrencyString({ value: orderConfirmation.total, currency: "usd" })}</div>
            </div>
          </div>
        </>}
      </>}
    </div>,
    el
  );
};

export default OrderConfirmation;