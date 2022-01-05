import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Product } from "../products";
import { useShoppingCart } from "use-shopping-cart/react";
import { formatCurrencyString } from "use-shopping-cart";
import ErrorMessage from "./ErrorMessage";
import LoadingIndicator from "./LoadingIndicator";

interface ProductProps {
  productId: string;
}

const el = document.getElementById("add-to-cart");

const AddToCart: React.FC<ProductProps> = ({productId}) => {
  const cart = useShoppingCart();
  const { addItem, cartDetails } = cart;
  const [product, setProduct] = useState<Product>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  function loadProduct() {
    fetch("/product/" + productId)
      .then(response => response.json())
      .then(product => setProduct(product))
      .catch((error) => setError(error))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => loadProduct(), []);

  const alreadyInCart = product && cartDetails[product.id] && cartDetails[product.id].quantity > 0;

  return ReactDOM.createPortal(
    <div>
      {error ? <ErrorMessage error={error} onRetry={() => loadProduct()}/> : <>
        {isLoading ? <LoadingIndicator /> : <>
          <div className="d-sm-flex align-items-center">
            <div className="flex-grow-1 my-3">
                <span className="mb-0 mr-3">{product.localName}</span>
                <span className="font-weight-bold">{formatCurrencyString({ value: product.price, currency: product.currency })}</span>
            </div>
            <button className="btn btn-primary" disabled={alreadyInCart}
              onClick={() => addItem(product)}>{alreadyInCart ? "Added to cart" : "Add to cart"}</button>
          </div>
        </>}
      </>}
    </div>,
    el
  );
}

export default AddToCart;