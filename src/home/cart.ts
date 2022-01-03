import { Request, Response, json } from "express";
import { validateCartItems } from "use-shopping-cart/utilities/serverless";
import { Stripe } from "stripe";
import productsRaw from "../music/products.json";
import { AppError } from "../shared/errors";
import config from "config";

export function postCart(req: Request, res: Response) {
  const stripe = new Stripe(config.get<string>("stripeSecretKey"), {
    apiVersion: "2020-08-27",
  });

  const cartDetails = req.body;
  const validatedItems = validateCartItems(productsRaw, cartDetails);
  const rootUrl = req.protocol + '://' + req.get('host');

  return stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: rootUrl + "/thank-you",
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