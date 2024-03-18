import { Request, Response, Router } from "express";
import { Stripe } from "stripe";
import { AppError, NotFound } from "../shared/errors.js";
import { getProduct as findProduct } from "./products.js";
import { getStripeApi } from "./products.js";
import moment from "moment";
import { formatFilesize } from "../shared/formatters.js";
import { getGoogleDriveApi } from "../shared/googleDrive.js";
import { createAirtableOrder, getAirtableBase, getAirtableOrder, getAirtableProducts  } from "../shared/airtable.js";
import { formatDate, isDateInPast } from "../shared/dateHelpers.js";
import config from "config";
import PromiseRouter from "express-promise-router";
import { CartDetails } from "use-shopping-cart/core";
import { OrderDownloads, GoogleDriveDownload } from "../../shared/types.js";

const router = PromiseRouter();

router.post("/api/session", async (req: Request<{}, {}, CartDetails>, res: Response) => {
  const stripe = getStripeApi();

  const cartDetails = req.body;
  const rootUrl = req.protocol + "://" + req.get("host");

  const validatedItems = Object.keys(cartDetails).map(id => {
    const inventoryProduct = findProduct(id);

    if (!inventoryProduct) {
      throw new Error(`Invalid Cart: product with id "${id}" is not in your inventory.`);
    }

    return {
      quantity: cartDetails[id].quantity,
      price: inventoryProduct.id
    };
  });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: rootUrl + "/thank-you?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: rootUrl + "/cart",
      line_items: validatedItems
    });

    res.json({
      sessionId: session.id
    });
  } catch (error) {
    throw new AppError("An error occurred communicating with Stripe", 500, error);
  }
});

router.get("/thank-you", (req: Request, res: Response) => {
  const sessionId = req.query.session_id;
  if (!sessionId) {
    res.redirect("/cart");
    return;
  }

  res.render("thank-you", { title: "Thank you" });
});

router.get("/api/order-confirmation", async (req: Request<{}, {}, {}, { sessionId: string}>, res: Response) => {
  const stripe = getStripeApi();

  try {
    const sessionResponse = await stripe.checkout.sessions.retrieve(req.query.sessionId, { expand: ["payment_intent"] });
    const lineItemsResponse = await stripe.checkout.sessions.listLineItems(req.query.sessionId, { limit: 100 });
    const paymentIntent = sessionResponse.payment_intent as Stripe.PaymentIntent;

    res.json({ timestamp: paymentIntent.created, total: sessionResponse.amount_total, items: lineItemsResponse.data });
  } catch (error) {
    throw new AppError("An error occurred communicating with Stripe", 500, error);
  }
});

router.get("/api/product/:productId", (req: Request, res: Response) => {
  const product = findProduct(req.params.productId);

  if (!product) {
    throw NotFound;
  }

  res.json(product);
});

const orderDownloadsCache: {[orderId: string]: OrderDownloads} = {};

async function getOrderDownloads(orderId: string) {
  if (orderDownloadsCache[orderId]) {
    return orderDownloadsCache[orderId];
  }

  const base = getAirtableBase();
  const googleDriveApi = await getGoogleDriveApi();
  const order = await getAirtableOrder(base, orderId);

  if (!order) {
    throw NotFound;
  }
  const expirationDate = moment(order.get("Expiration Date") as string, "YYYY-MM-DD");

  if (isDateInPast(expirationDate)) {
    const orderDownloads = {
      id: orderId,
      downloads: [],
      expirationDate: expirationDate,
      isExpired: true,
    };
    orderDownloadsCache[orderId] = orderDownloads;

  } else {
    const productIds = order.get("Products") as string[];
    const products = await getAirtableProducts(base, productIds);

    const downloads: GoogleDriveDownload[] = [];
    for (const productId of productIds) {
      const product = products.find(product => product.id === productId);
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
      expirationDate: expirationDate,
      isExpired: false
    };
    orderDownloadsCache[orderId] = orderDownloads;
  }

  return orderDownloadsCache[orderId];
}

router.get("/order/:orderId", async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  if (!orderId) {
    throw NotFound;
  }

  const orderDownloads = await getOrderDownloads(orderId);
  res.render("order", {
    title: "Order Downloads",
    order: orderDownloads,
    formatFilesize: formatFilesize,
    formatDate: formatDate
  });
});

router.get("/order/:orderId/download/:downloadId", async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const downloadId = +req.params.downloadId;
  if (!orderId || !downloadId) {
    throw NotFound;
  }
  const googleDriveApi = await getGoogleDriveApi();
  const orderDownloads = await getOrderDownloads(orderId);
  if (downloadId > orderDownloads.downloads.length) {
    return NotFound;
  }

  const download = orderDownloads.downloads[downloadId - 1];
  res.setHeader("Content-Type", download.mimeType);
  res.setHeader("Content-disposition", "attachment; filename=" + download.name);
  res.setHeader("Transfer-Encoding", "chunked");

  const stream = await googleDriveApi.files.get({ fileId: download.id, alt: "media" }, { responseType: "stream" });
  stream.data.on("data", (chunk) => res.write(chunk));
  stream.data.on("end", () => res.end());
});

router.post("/stripe-webhook", async (req: Request & { rawBody: string }, res: Response) => {
  const stripe = getStripeApi();
  const webhookSecret = config.get<string>("stripeWebhookSecret");
  const signature = req.headers["stripe-signature"];
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, signature, webhookSecret);
  } catch (err) {
    throw new AppError(`Webhook Error: ${err.message}`, 400);
  }

  if (event.type === "payment_intent.succeeded") {
    await handleNewPaymentIntent(event.data.object as Stripe.PaymentIntent);
  }

  res.json({ received: true });
});

async function handleNewPaymentIntent(paymentIntent: Stripe.PaymentIntent) {
  await createAirtableOrder(paymentIntent);
}

export const EcommerceRoutes: Router = router;