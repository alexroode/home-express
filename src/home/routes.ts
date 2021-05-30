import { Router, Request, Response } from "express";
import PromiseRouter from "express-promise-router";
import { IContactRequest } from "./contactRequest";
import { recaptcha, recaptchaSiteKey } from "../recaptcha";
import { RecaptchaResponseDataV3 } from "express-recaptcha/dist/interfaces";
import * as Mailgun from "mailgun-js";
import * as config from "config";
import { Music } from "../music/musicService";
import { formatDate, formatPieceYear, formatYear } from "../shared/dateHelpers";

const router = PromiseRouter();

router.get("/", (req: Request, res: Response) => {
  return Music.getLatest(4)
      .then(pieces => {
        res.render("index", {
          title: "Home",
          latestWork: pieces,
          formatDate: formatDate,
          formatYear: formatYear,
          formatPieceYear: formatPieceYear
        });
    });
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

  const mailGun = new Mailgun({ apiKey: config.get<string>("mailgunApiKey"), domain: config.get<string>("mailgunDomain")});

  const message: Mailgun.messages.SendData = {
    to: config.get<string>("contactToEmail"),
    from: "Contact Form <contact@alexander-roode.com>",
    subject: "Contact Form Submission",
    html: `<strong>Name</strong>: ${data.name}<br/>` +
    `<strong>Email</strong>: ${data.email}<br/>` +
    `<strong>Message</strong>: <br/><p>${data.message}</p>`
  };

  return mailGun.messages()
    .send(message)
    .then(() => res.sendStatus(204))
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    });
});

export const HomeRoutes: Router = router;
