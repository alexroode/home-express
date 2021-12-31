import React, { ReactNode } from "react";
import ReactDOM from "react-dom";
import { CartProvider } from "use-shopping-cart/react";
import productsRaw from "../../music/products.json";
import { Product } from "../../music/music";
import Cart from "./Cart";
import CartSummary from "./CartSummary";
import AddToCart from "./AddToCart";

declare const CONFIG: {
  stripePublishableKey: string;
}

const el = document.getElementById("cart-app");
const cartContents = document.getElementById("cart-contents");
const addToCart = document.getElementById("add-to-cart");

const products = productsRaw as Product[];
function getProduct(id: number): Product {
  return products.find(p => p.localId === id);
}
let addToCartNode: ReactNode = null;
if (addToCart) {
  const productId = addToCart.getAttribute("data-product-id");
  addToCartNode = <AddToCart product={getProduct(Number(productId))} />
}

ReactDOM.render(
  <React.StrictMode>
    <CartProvider
      cartMode="checkout-session"
      stripe={CONFIG.stripePublishableKey}
      currency="USD"
      loading={<p aria-live="polite">Loading...</p>}
    >
      {addToCartNode}
      {cartContents ? <Cart /> : null}
      {cartContents ? null : <CartSummary />}
    </CartProvider>
  </React.StrictMode>,
  el
);