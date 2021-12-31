import React from "react";
import ReactDOM from "react-dom";
import { Product } from "../../music/music";
import { useShoppingCart } from "use-shopping-cart/react";
import { formatCurrencyString } from "use-shopping-cart";

interface ProductProps {
  product: Product;
}

const el = document.getElementById("add-to-cart");

const AddToCart: React.FC<ProductProps> = ({product}) => {
  const cart = useShoppingCart();
  const { addItem, cartDetails } = cart;
  const alreadyInCart = cartDetails[product.id] && cartDetails[product.id].quantity > 0;

  return ReactDOM.createPortal(
    <div>
      <div className="d-flex align-items-center">
        <div className="flex-grow-1">
            <span className="mb-0 mr-3">{product.localName}</span>
            <span className="font-weight-bold">{formatCurrencyString({ value: product.price, currency: product.currency })}</span>
        </div>
        <button className="btn btn-primary" disabled={alreadyInCart}
           onClick={() => addItem(product)}>{alreadyInCart ? "Added to cart" : "Add to cart"}</button>
      </div>
    </div>,
    el
  );
}

export default AddToCart;