import { Request, Response, json } from "express";
import { Stripe } from "stripe";
import { AppError, NotFound } from "../shared/errors";
import { getProduct as findProduct, GoogleDriveDownload, OrderDownloads, Product } from "./products";
import { getStripeApi } from "./products";
import Airtable from "airtable";
import { google } from "googleapis";
import config from "config";
import moment from "moment";

export function postCart(req: Request, res: Response) {
  const stripe = getStripeApi();

  const cartDetails = req.body;
  const rootUrl = req.protocol + '://' + req.get('host');

  let validatedItems = [];
  for (const id in cartDetails) {
    const inventoryProduct: Product = findProduct(id);
    if (!inventoryProduct) {
      throw new Error(`Invalid Cart: product with id "${id}" is not in your inventory.`);
    }
    validatedItems.push({
      quantity: cartDetails[id].quantity,
      price: inventoryProduct.id
    });
  }

  return stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: rootUrl + "/thank-you?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: rootUrl + "/cart",
    line_items: validatedItems
  })
  .then(session => {
    res.json({
      sessionId: session.id
    });
  }).catch(error => {
    throw new AppError("An error occurred communicating with Stripe", 500, error);
  });
}

export function thankYou(req: Request, res: Response) {
  const sessionId = req.query.session_id;
  if (!sessionId) {
    res.redirect("/cart");
    return;
  }

  res.render("thank-you", { title: "Thank you" });
}

export async function orderDetails(req: Request, res: Response) {
  const stripe = getStripeApi();
  const sessionId: string = req.query.sessionId as string;

  try {
    const sessionResponse = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["payment_intent"] });
    const lineItemsResponse = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 100 });
    const paymentIntent = sessionResponse.payment_intent as Stripe.PaymentIntent;

    res.json({ timestamp: paymentIntent.created, total: sessionResponse.amount_total, items: lineItemsResponse.data });
  } catch (error) {
    throw new AppError("An error occurred communicating with Stripe", 500, error);
  }
}

export async function getProduct(req: Request, res: Response) {
  const product = findProduct(req.params.productId);

  if (!product) {
    throw NotFound;
  }

  res.json(product);
}

const orderDownloadsCache: {[orderId: string]: OrderDownloads} = {};

async function getOrderDownloads(orderId: string) {
  if (orderDownloadsCache[orderId]) {
    return orderDownloadsCache[orderId];
  }

  const airtable = new Airtable({apiKey: config.get<string>("airtableApiKey")});
  const base = airtable.base("appsgRvcL78zV7gTi");
  const googleDriveApi = await getGoogleDriveApi();
  const orderTableName = config.get<string>("airtableOrdersTableName");
  const productsTableName = config.get<string>("airtableProductsTableName");

  const records = await base.table(orderTableName).select({ filterByFormula: `{URL ID} = "${orderId}"` }).all();

  if (records.length === 0) {
    throw NotFound;
  }

  const record = records[0];
  const productIds = record.get("Products") as string[];
  const productsTable = base.table(productsTableName);
  const downloads: GoogleDriveDownload[] = [];

  for (const productId of productIds) {
    const product = await productsTable.find(productId);
    const googleDriveId = product.get("Google Drive ID") as string;

    const file = await googleDriveApi.files.get({ fileId: googleDriveId, fields: "id, name, size, mimeType" });
    downloads.push({
      id: file.data.id,
      mimeType: file.data.mimeType,
      size: file.data.size,
      name: file.data.name
    });
  }

  const orderDownloads = {
    id: orderId,
    downloads,
    expirationDate: moment(record.get("Expiration Date") as string, "YYYY/MM/DD")
  };
  orderDownloadsCache[orderId] = orderDownloads;
  return orderDownloads;
}

export async function orderDownloads(req: Request, res: Response) {
  const orderId = req.params.orderId;
  if (!orderId) {
    throw NotFound;
  }
  const orderDownloads = await getOrderDownloads(orderId);
  res.render("order", { title: "Your Order", order: orderDownloads });
}

async function getGoogleDriveApi() {
  const jwtClient = new google.auth.JWT(
    config.get<string>("googleClientEmail"),
    null,
    config.get<string>("googleClientPrivateKey"),
    ["https://www.googleapis.com/auth/drive"]
  );
  await jwtClient.authorize();
  return google.drive({ auth: jwtClient, version: "v3"});
}