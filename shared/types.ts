import { Stripe } from "stripe";
import moment from "moment";

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly localName: string;
  readonly description: string;
  readonly price: number;
  readonly currency: string;
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

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
}