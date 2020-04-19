import { Router, Request, Response } from "express";
import PromiseRouter from "express-promise-router";
import { IContactRequest } from "./contactRequest";
import { recaptcha, recaptchaSiteKey } from "../recaptcha";
import { RecaptchaResponseDataV3 } from "express-recaptcha/dist/interfaces";
import { MailService } from "@sendgrid/mail";
import { MailDataRequired } from "@sendgrid/helpers/classes/mail";
import * as config from "config";

const router = PromiseRouter();

router.get("/", (req: Request, res: Response) => {
  res.render("index", { title: "Home" });
});

router.get("/bio", (req: Request, res: Response) => {
  res.render("bio", { title: "Bio" });
});

router.get("/contact", (req: Request, res: Response) => {
  res.render("contact", { title: "Contact", recaptchaSiteKey });
});

router.post("/contact", recaptcha.middleware.verify, (req: Request, res: Response) => {
  const data: IContactRequest = req.body;

  if (!req.recaptcha ||
      req.recaptcha.error ||
      !((req.recaptcha.data as RecaptchaResponseDataV3).score) ||
      (req.recaptcha.data as RecaptchaResponseDataV3).score < 0.5) {
    res.sendStatus(400);
    return;
  }

  const message: MailDataRequired = {
    to: config.get<string>("contactToEmail"),
    from: "Contact Form <contact@alexander-roode.com>",
    subject: "Contact Form Submission",
    html: `<strong>Name</strong>: ${data.name}<br/>` +
    `<strong>Email</strong>: ${data.email}<br/>` +
    `<strong>Message</strong>: <br/><p>${data.message}</p>`
  };

  const mailService = new MailService();
  mailService.setApiKey(config.get<string>("sendGridApiKey"));

  return mailService
    .send(message)
    .then(() => res.sendStatus(204))
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    });
});

export const HomeRoutes: Router = router;
