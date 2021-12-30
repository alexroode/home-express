import React from "react";
import ReactDOM from "react-dom";
import Cart from "./Cart";
import { CartProvider } from "use-shopping-cart/react";
import productsRaw from "../../music/products.json";
import ProductComponent from "./Product";
import { Product } from "../../music/music";
import CartSummary from "./CartSummary";

declare const CONFIG: {
  stripePublishableKey: string;
}

const el = document.getElementById("cart-app");
/*
const productId = el.getAttribute("data-product-id");
const products = productsRaw as Product[];
function getProduct(id: number): Product {
  return products.find(p => p.localId === id);
}
const root = productId ? <ProductComponent product={getProduct(Number(productId))} /> : <Cart />;
*/
ReactDOM.render(
<React.StrictMode>
  <CartProvider
    cartMode="checkout-session"
    stripe={CONFIG.stripePublishableKey}
    currency="USD"
    loading={<p aria-live="polite">Loading...</p>}
  >
      <CartSummary />
    </CartProvider>
  </React.StrictMode>,
  el
);