import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
import { HomeRoutes } from "./home/routes";
import { MusicRoutes } from "./music/routes";
import * as errorHandler from "errorhandler";

const app = express();
const router = express.Router();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"), { maxAge: 31557600000 }));

app.use("/", HomeRoutes);
app.use("/music", MusicRoutes);

app.listen(app.get("port"), () => {
  console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
  console.log("  Press CTRL-C to stop\n");
});

app.use(errorHandler());

module.exports = app;