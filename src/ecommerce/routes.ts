import { Request, Response, json } from "express";
import { Stripe } from "stripe";
import { AppError, NotFound } from "../shared/errors";
import { getProduct as findProduct, Product } from "./products";
import { getStripeApi } from "./products";

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