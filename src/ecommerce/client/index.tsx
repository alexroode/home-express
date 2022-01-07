import React, { ReactNode } from "react";
import ReactDOM from "react-dom";
import { CartProvider } from "use-shopping-cart/react";
import Cart from "./Cart";
import CartSummary from "./CartSummary";
import AddToCart from "./AddToCart";
import OrderConfirmation from "./OrderConfirmation";
import LoadingIndicator from "./LoadingIndicator";

const el = document.getElementById("cart-app");
const stripePublishableKey = el.getAttribute("data-stripe-publishable-key");
const cartContents = document.getElementById("cart-contents");
const addToCart = document.getElementById("add-to-cart");
const orderConfirmation = document.getElementById("order-confirmation");

let addToCartNode: ReactNode = null;
if (addToCart) {
  const productId = addToCart.getAttribute("data-product-id");
  addToCartNode = <AddToCart productId={productId} />;
}

ReactDOM.render(
  <React.StrictMode>
    <CartProvider
      cartMode="checkout-session"
      stripe={stripePublishableKey}
      currency="USD"
      loading={<LoadingIndicator />}
    >
      {addToCartNode}
      {cartContents ? <Cart /> : null}
      {cartContents ? null : <CartSummary />}
      {orderConfirmation ? <OrderConfirmation /> : null}
    </CartProvider>
  </React.StrictMode>,
  el
);