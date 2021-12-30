import React from "react";
import { useShoppingCart, DebugCart } from "use-shopping-cart/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'

const CartSummary: React.FC = () => {
  const { cartCount } = useShoppingCart();

  return (
    <a href="/cart" className="cart-summary btn btn-secondary">
        <div className="d-flex align-items-center">
          <FontAwesomeIcon icon={faShoppingCart} className="mr-2 font-125" />
          <span>View Cart</span>
          <span className="badge badge-pill badge-dark ml-2 rounded-lg">{cartCount}</span>
        </div>
    </a>
  );
};

export default CartSummary;