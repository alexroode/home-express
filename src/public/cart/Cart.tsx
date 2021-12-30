import React from "react";
import { useShoppingCart, DebugCart } from "use-shopping-cart/react";

const Cart: React.FC = () => (
  <div>
    <DebugCart />
  </div>
);

export default Cart;