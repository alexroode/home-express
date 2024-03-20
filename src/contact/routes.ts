import { Router, Request, Response } from "express";
import PromiseRouter from "express-promise-router";
import { recaptcha, recaptchaSiteKey } from "../shared/recaptcha.js";
import { ContactRequest } from "../../shared/types.js";
import { RecaptchaResponseDataV3 } from "express-recaptcha/dist/interfaces";
import formData from "form-data";
import Mailgun from "mailgun.js";
import config from "config";

const router = PromiseRouter();

router.get("/contact", (_req: Request, res: Response) => {
  res.render("contact", { title: "Contact", recaptchaSiteKey });
});

router.post("/api/contact", recaptcha.middleware.verify, async (req: Request<{}, {}, ContactRequest>, res: Response) => {

  if (!req.recaptcha ||
      req.recaptcha.error ||
      !((req.recaptcha.data as RecaptchaResponseDataV3).score) ||
      (req.recaptcha.data as RecaptchaResponseDataV3).score < 0.5) {
    res.sendStatus(400);
    return;
  }

  const data = req.body;
  const mailgun = new Mailgun.default(formData);
  const mailgunClient = mailgun.client({ key: config.get<string>("mailgunApiKey"), username: "api" });

  const message = {
    to: [config.get<string>("contactToEmail")],
    from: "Contact Form <contact@alexander-roode.com>",
    subject: "Contact Form Submission",
    html: `<strong>Name</strong>: ${data.name}<br/>` +
    `<strong>Email</strong>: ${data.email}<br/>` +
    `<strong>Message</strong>: <br/><p>${data.message}</p>`
  };

  try {
    await mailgunClient.messages
      .create(config.get<string>("mailgunDomain"), message);
    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

export const ContactRoutes: Router = router;