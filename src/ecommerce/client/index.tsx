import React, { ReactNode } from "react";
import ReactDOM from "react-dom";
import { CartProvider } from "use-shopping-cart/react";
import { Product } from "../products";
import Cart from "./Cart";
import CartSummary from "./CartSummary";
import AddToCart from "./AddToCart";
import OrderConfirmation from "./OrderConfirmation";
import LoadingIndicator from "./LoadingIndicator";

declare const CONFIG: {
  stripePublishableKey: string;
}

const el = document.getElementById("cart-app");
const cartContents = document.getElementById("cart-contents");
const addToCart = document.getElementById("add-to-cart");
const orderConfirmation = document.getElementById("order-confirmation");

let addToCartNode: ReactNode = null;
if (addToCart) {
  const productId = addToCart.getAttribute("data-product-id");
  addToCartNode = <AddToCart productId={productId} />
}

ReactDOM.render(
  <React.StrictMode>
    <CartProvider
      cartMode="checkout-session"
      stripe={CONFIG.stripePublishableKey}
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