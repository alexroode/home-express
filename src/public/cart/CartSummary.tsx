import React from "react";
import { useShoppingCart, DebugCart } from "use-shopping-cart/react";

const CartSummary: React.FC = () => {
  const { cartCount } = useShoppingCart();

  return (
    <div>
      {cartCount}
    </div>
  );
};

export default CartSummary;