import { Stripe } from "stripe";
import config from "config";
import { Music } from "../music/musicService";
import moment from "moment";

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly localName: string;
  readonly description: string;
  readonly price: number;
  readonly currency: string;
}

export function getStripeApi() {
  return new Stripe(config.get<string>("stripeSecretKey"), {
    apiVersion: "2020-08-27",
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

export interface OrderConfirmation {
  readonly timestamp?: number;
  readonly total: number;
  readonly items: Stripe.LineItem[];
}

export interface OrderDownloads {
  readonly id: string;
  readonly expirationDate: moment.Moment;
  readonly downloads: OrderDownload[];
  readonly isExpired: boolean;
}

export interface OrderDownload {
  readonly name: string;
  readonly size: string;
  readonly mimeType: string;
}