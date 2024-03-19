import { Router, Request, Response } from "express";
import PromiseRouter from "express-promise-router";
import { Music } from "../music/musicService.js";
import { formatDate, formatPieceYear, formatYear } from "../shared/dateHelpers.js";

const router = PromiseRouter();

router.get("/", async (_req: Request, res: Response) => {
  const pieces = await Music.getLatest(4);
  res.render("index", {
    title: "Home",
    latestWork: pieces,
    formatDate: formatDate,
    formatYear: formatYear,
    formatPieceYear: formatPieceYear
  });
});

router.get("/bio", (_req: Request, res: Response) => {
  res.render("bio", { title: "Bio" });
});

router.get("/cart", (_req: Request, res: Response) => {
  res.render("cart", { title: "Cart" });
});

router.get("/privacy-policy", (_req: Request, res: Response) => {
  res.render("privacy-policy", { title: "Privacy Policy"});
});

export const HomeRoutes: Router = router;
