import * as express from "express";
import { Request, Response, NextFunction } from "express";
import * as path from "path";
import { HomeRoutes } from "./home/routes";
import { MusicRoutes } from "./music/routes";
import { NotFound, AppError } from "./shared/errors";

const app = express();
const isDevelopment = app.get("env") === "development";

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(express.json());
app.use(express.static(path.join(__dirname, "../dist/public"), { maxAge: 31557600000 }));

app.use("/", HomeRoutes);
app.use("/music", MusicRoutes);

app.get("*", (req: Request, res: Response, next: NextFunction) => {
  next(NotFound);
});

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  if (!err.status) {
    err.status = 500;
    if (!isDevelopment) {
      err.message = "An unexpected error occurred";
    }
  }

  res.status(err.status);
  res.render("error", {
    error: err,
    isDev: isDevelopment,
    title: "Error " + res.statusCode
  });
});

app.listen(app.get("port"), () => {
  console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
  console.log("  Press CTRL-C to stop\n");
});

module.exports = app;