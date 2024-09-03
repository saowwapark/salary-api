import * as bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";;

// Use Only Dev
import logger from "morgan";
import errorHandler from "errorhandler";
import methodOverride from "method-override";

/** My Own Imports **/
import indexRoute from "./routes/route.index";
import { errorMiddleware } from "./middleware/error.middleware";

export class App {
  public app: express.Application;

  public static bootstrap(): App {
    return new App();
  }

  constructor() {
    //create expressjs application
    this.app = express();

    //configure application
    this.config();
  }

  public config() {
    // use logger middlware
    this.app.use(logger("dev"));

    // use json form parser middlware
    this.app.use(bodyParser.json());

    // use query string parser middlware
    // setup application to parse data that is sent as form-data
    this.app.use(
      bodyParser.urlencoded({
        extended: false,
      })
    );

    // user CORS
    this.app.use(
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        res.set("Access-Control-Allow-Origin", "*");
        res.set(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
        res.set(
          "Access-Control-Allow-Methods",
          "GET, POST, PATCH, PUT, DELETE, OPTIONS"
        );
        next();
      }
    );
    // Respond to preflight requests
    this.app.options("*", (req, res) => {
      res.sendStatus(204);
    });
    // use cookie parser middleware
    this.app.use(cookieParser("SECRET_GOES_HERE"));

    // use override middlware
    this.app.use(methodOverride());

    // catch 404 and forward to error handler
    this.app.use(function (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) {
      err.status = 404;
      next(err);
    });

    //error handling
    this.app.use(errorHandler());

    indexRoute(this.app);
    this.app.use(errorMiddleware);
  }
}
