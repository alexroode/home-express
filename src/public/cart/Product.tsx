import React from "react";
import { Product } from "../../music/music";
import { useShoppingCart } from "use-shopping-cart/react";
import CartSummary from "./CartSummary";
interface ProductProps {
  product: Product;
}

const ProductComponent: React.FC<ProductProps> = ({product}) => {
  const { addItem } = useShoppingCart();
  function addToCart(product: Product): void {
    console.log('adding product', product);
    addItem(product);
  }
  return (
    <div>
      <div className="d-flex align-items-center">
        <div className="flex-grow-1">
            <span className="mb-0 mr-3">{product.localName}</span>
            <span className="font-weight-bold">${product.price}</span>
        </div>
        <button className="btn btn-primary" onClick={() => addToCart(product)}>Add to Cart</button>
      </div>
      <CartSummary />
    </div>
  );
}

export default ProductComponent;