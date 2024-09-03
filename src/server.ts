/* Third Party Packages */
import http from "http";
import express from "express";
import { App } from "./app";

/* Configuration */
import { dbPool } from "./config/db.config";
import { serverConfigData } from "./config/server.config";

class Server {
  port: number;
  hostname: string;
  server: http.Server;

  constructor(port: string, hostname: string, app: Express.Application) {
    this.port = parseInt(port);
    this.hostname = hostname;

    // create server according to setting application
    this.server = http.createServer(app);
    this.server.listen(this.port, this.hostname);
    this.config();
  }

  config() {
    this.server.on("error", (error) => {
      this.onError(error);
    });
  }

  private onError(error: NodeJS.ErrnoException) {
    console.log(error);
    if (error.syscall !== "listen") {
      throw error;
    }
    const bind =
      typeof this.port === "string" ? "pipe " + this.port : "port " + this.port;
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges.");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use.");
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
}

/******************************** Main ******************************/

// setting application
const app: express.Application = App.bootstrap().app;

// create server
export const server = new Server(
  serverConfigData.port,
  serverConfigData.host,
  app
).server;

// kill [ps_id]
process.on("SIGTERM", () => {
  console.info("SIGTERM signal received.");
  console.log("Closing http server.");
  server.close(() => {
    console.log("Http server closed.");
    try {
      console.log("Ending Db connection.");
      dbPool.end();
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });
});

// ctrl + c
process.on("SIGINT", () => {
  console.log("SIGINT signal received.");
  console.log("Closing http server.");
  server.close(() => {
    console.log("Http server closed.");
    try {
      console.log("Ending Db connection.");
      dbPool.end();
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });
});
