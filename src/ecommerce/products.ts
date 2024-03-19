import { Stripe } from "stripe";
import config from "config";
import { Music } from "../music/musicService.js";
import { Product } from "../../shared/types.js";

export function getStripeApi() {
  return new Stripe(config.get<string>("stripeSecretKey"), {
    apiVersion: "2023-10-16",
  });
}

let productsCache: Product[] = [];
export async function loadProducts() {
  const api = getStripeApi();
  const priceResponse = await api.prices.list({ limit: 100, expand: ["data.product"] });
  const musicLibrary = await Music.getLibrary();

  const products = musicLibrary.pieces
    .filter(piece => piece.products)
    .flatMap(piece => piece.products)
    .flatMap(stripePriceReference => {
      const price = priceResponse.data.find(p => stripePriceReference.priceId === p.id);
      if (!price) {
        return [];
      }

      const product = price.product as Stripe.Product;
      return {
        id: price.id,
        currency: price.currency,
        price: price.unit_amount,
        name: product.name,
        description: product.description,
        localName: stripePriceReference.name
      };
    });

  productsCache = products;
}

export function getProduct(stripePriceId: string): Product {
  return productsCache.find(product => product.id === stripePriceId);
}