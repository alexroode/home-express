import PromiseRouter from "express-promise-router";
import { Music } from "./musicService";
import { Request, Response, Router } from "express";
import { Category } from "./music";
import { formatYear, formatDate, formatPieceYear } from "../shared/dateHelpers";
import { formatDuration, formatGrade } from "../shared/formatters";

const router = PromiseRouter();

router.get("/", async (_req: Request, res: Response) => {
  const music = await Music.getLibrary();
  res.render("music/index", { title: "Music", categories: music.categories });
});

interface CategoryRequest extends Request {
  category: Category;
}

router.get("/:categoryId", async (req: CategoryRequest, res: Response) => {
  const category = await Music.findCategory(req.params.categoryId);
  req.category = category;

  const pieces = await Music.getInCategory(req.params.categoryId);
  res.render("music/category", {
    title: req.category.name,
    category: req.category,
    pieces: pieces,
    ...common
  });
});

router.get("/:categoryId/:pieceId", async (req: Request, res: Response) => {
  const piece = await Music.findPiece(req.params.pieceId, req.params.categoryId);
  const products = (piece.products || []).filter(product => product.prod === !res.locals.isDevelopment);

  res.render("music/piece", {
    title: piece.title,
    piece: piece,
    products: products,
    ...common
  });
});

const common = {
  formatPieceYear: formatPieceYear,
  formatYear: formatYear,
  formatDate: formatDate,
  formatDuration: formatDuration,
  formatGrade: formatGrade
};

export const MusicRoutes: Router = router;