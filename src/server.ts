/*import config from "config";
import express from "express";
import { Request, Response, NextFunction } from "express";
import * as path from "path";
import { loadProducts } from "./ecommerce/products";
import { ContactRoutes } from "./contact/routes";
import { EcommerceRoutes } from "./ecommerce/routes";
import { HomeRoutes } from "./home/routes";
import { MusicRoutes } from "./music/routes";
import { NotFound, AppError } from "./shared/errors";
import { rawBodySaver } from "./shared/rawBody";

const app = express();
const isDevelopment = app.get("env") === "development";

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(express.json({ verify: rawBodySaver }) as NextFunction);
app.use(express.static(path.join(__dirname, "../dist/public"), { maxAge: 31557600000 }));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.isDevelopment = isDevelopment;
  res.locals.stripePublishableKey = config.get<string>("stripePublishableKey");
  next();
});

app.use("/", HomeRoutes);
app.use("/", ContactRoutes);
app.use("/", EcommerceRoutes);
app.use("/music", MusicRoutes);

app.get("*", (req: Request, res: Response, next: NextFunction) => {
  next(NotFound);
});

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.url = req.url;
  err.method = req.method;

  console.error(err);

  const isJson = req.url.startsWith("/api") || req.url.indexOf("webhook") > -1;

  if (!err.status) {
    err.status = 500;
    if (!isDevelopment) {
      err.message = "An unexpected error occurred. Please try again later.";
    }
  }

  if (!isDevelopment) {
    err.details = undefined;
  }

  res.status(err.status);
  if (isJson) {
    res.json(err);
  } else {
    res.render("error", {
      error: err,
      isDev: isDevelopment,
      title: "Error " + res.statusCode
    });
  }
});

loadProducts().then(() => {
  app.listen(app.get("port"), () => {
    console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
    console.log("  Press CTRL-C to stop\n");
  });
}).catch(err => {
  console.log(err);
  throw new Error(err);
});

module.exports = app;*/

import Fastify from "fastify";
import FastifyView from "@fastify/view";
import FastifyStatic from "@fastify/static";
import fastifyRecaptcha from "fastify-recaptcha";
import pug from "pug";
import config from "config";
import * as path from "path";
import { HomeRoutes } from "./home/routes";
import { formatDate, formatPieceYear, formatYear } from "./shared/dateHelpers";
import { ContactRoutes } from "./contact/routes";
import { request } from "http";
import { NotFound } from "./shared/errors";

const fastify = Fastify({
  logger: true
});

fastify.register(FastifyView, {
  engine: {
    pug: pug
  },
  root: "./views",
  includeViewExtension: true,
  defaultContext: {
    copyrightYear: new Date().getFullYear(),
    formatDate: formatDate,
    formatYear: formatYear,
    formatPieceYear: formatPieceYear
  }
});

fastify.register(FastifyStatic, {
  root: path.join(__dirname, "../dist/public")
});

fastify.register(fastifyRecaptcha, {
  recaptcha_secret_key: config.get<string>("recaptchaSecretKey"),
  reply: true
});

fastify.register(HomeRoutes);
fastify.register(ContactRoutes);

fastify.setNotFoundHandler((_request, reply) => {
  reply.status(404).send(new NotFound());
});

fastify.setErrorHandler((error, request, reply) => {
  const isJson = request.url.startsWith("/api") || request.url.indexOf("webhook") > -1;

  switch (error.code) {
    case "NOT_FOUND":
      
  }
  if (!error.message) {
    error.message = "An unexpected error occurred. Please try again later.";
  }
  /*if (!err.status) {
    err.status = 500;
    if (!isDevelopment) {
      err.message = 
    }
  }

  if (!isDevelopment) {
    err.details = undefined;
  }*/

  reply.status(error.statusCode || 500);

  if (isJson) {
    reply.send(error);
  } else {
    reply.view("error", {
      error: error,
      isDev: true,
      title: "Error " + reply.statusCode
    });
  }
});

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});