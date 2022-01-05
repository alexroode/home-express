import React from "react";
import { useShoppingCart } from "use-shopping-cart/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'

const CartSummary: React.FC = () => {
  const cart = useShoppingCart();
  const { cartCount } = cart;

  const summary = <a href="/cart" className="cart-summary btn btn-secondary w-100">
    <div className="d-flex align-items-center justify-content-center ">
      <span className="badge badge-pill badge-dark mr-2 rounded-lg">{cartCount}</span>
      <FontAwesomeIcon icon={faShoppingCart} className="mr-2 font-150" />
      <span>View Cart</span>
    </div>
  </a>;

  return (
    <>
      {cartCount > 0 ? summary : null}
    </>
  );
};

export default CartSummary;