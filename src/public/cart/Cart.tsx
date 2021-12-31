import React from "react";
import ReactDOM from "react-dom";
import { useShoppingCart } from "use-shopping-cart/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';

const el = document.getElementById("cart-contents");
const Cart: React.FC = () => {
  const cart = useShoppingCart();
  const { cartDetails, removeItem, formattedTotalPrice, cartCount } = cart;

  const cartItems = Object.values(cartDetails ?? {}).map((item) => (
    <div key={item.id} className="d-flex align-items-center position-relative py-2">
      <button className="btn btn-link link-danger font-125 position-absolute remove-button" onClick={() => removeItem(item.id)}>
        <FontAwesomeIcon icon={faTimesCircle} />
      </button>
      <div className="d-sm-flex ml-5 flex-grow-1">
        <div className="flex-grow-1">{item.name}</div>
        <div className="font-weight-bold">{item.formattedValue}</div>
      </div>
    </div>
  ))

  return ReactDOM.createPortal(
    <div>
      {cartItems.length > 0 ? (
        <div>
          {cartItems}
          <div className="d-flex">
            <div className="d-sm-flex ml-5 flex-grow-1">
              <div className="flex-grow-1">Total</div>
              <div className="font-weight-bold">{formattedTotalPrice}</div>
            </div>
          </div>

          <div className="mt-s2">
            {cartCount > 0 ? <button className="btn btn-primary w-100 w-sm-auto">Proceed to Checkout</button> : null}
          </div>
        </div>
      ): <p>Your cart is empty.</p>}
    </div>,
    el
  );
}

export default Cart;