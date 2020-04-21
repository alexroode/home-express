import PromiseRouter from "express-promise-router";
import { Music } from "./musicService";
import { Request, Response, Router } from "express";
import { Category } from "./music";
import { formatYear, formatDate } from "../shared/dateHelpers";

const router = PromiseRouter();

router.get("/", (req: Request, res: Response) => {
  return Music.getAll().then(function(music) {
    res.render("music/index", { title: "Music", categories: music.categories});
  });
});

interface CategoryRequest extends Request {
  category: Category;
}

router.get("/:categoryId", (req: CategoryRequest, res: Response) => {
  return Music.findCategory(req.params.categoryId)
    .then(category => req.category = category)
    .then(() => Music.getInCategory(req.params.categoryId)
      .then(pieces => {
        res.render("music/category", {
          title: req.category.name,
          category: req.category,
          pieces: pieces,
          formatYear: formatYear
        });
    }));
});

router.get("/:categoryId/:pieceId", (req: Request, res: Response) => {
  return Music.findPiece(req.params.pieceId, req.params.categoryId)
    .then(piece => {
      res.render("music/piece", {
        title: piece.title,
        piece: piece,
        formatYear: formatYear,
        formatDate: formatDate
      });
    });
});

export const MusicRoutes: Router = router;