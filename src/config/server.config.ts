import * as dotenv from "dotenv";

export interface BackendEnv {
  host: string;
  port: string;
  dbEnv: DatabaseEnv;
}
export interface DatabaseEnv {
  dbHost: string;
  dbPort: string;
  dbUserName: string;
  dbPassword: string;
}

class ServerConfiguration {
  private serverConfigData!: BackendEnv;
  constructor() {
    this.readEnvironment();
    this.setServerConfigData();
    this.logEnv();
  }
  public getEnvData() {
    return this.serverConfigData;
  }
  private readEnvironment() {
    if (process.env.NODE_ENV === "dev") {
      dotenv.config({
        path: `${__dirname}/../../.env.dev`,
      });
    } else {
      dotenv.config({
        path: `${__dirname}/../../.env.prod`,
      });
    }
  }

  private logEnv() {
    if (process.env.NODE_ENV === "dev") {
      console.log(
        `Back-end host: ${this.serverConfigData.host}:${this.serverConfigData.port}`
      );
      console.log(
        `Database host: ${this.serverConfigData.dbEnv?.dbHost}:${this.serverConfigData.dbEnv?.dbPort}`
      );
      console.log("dbUserName: " + this.serverConfigData.dbEnv?.dbUserName);
      console.log("dbPassword: " + this.serverConfigData.dbEnv?.dbPassword);
    } else {
      console.log(
        `Back-end host: ${this.serverConfigData.host}:${this.serverConfigData.port}`
      );
      console.log(
        `Database host: ${this.serverConfigData.dbEnv?.dbHost}:${this.serverConfigData.dbEnv?.dbPort}`
      );
      console.log("dbUserName: " + this.serverConfigData.dbEnv?.dbUserName);
    }
  }

  private setServerConfigData() {
    const host = process.env.HOST;
    const port = process.env.PORT;
    const dbHost = process.env.DB_HOST;
    const dbPort = process.env.DB_PORT;
    const dbUserName = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;

    // Check for required environment variables
    if (
      !host ||
      !port ||
      !dbPassword ||
      !dbHost ||
      !dbPort ||
      !dbUserName ||
      !dbPassword
    ) {
      throw new Error(
        "Required environment variables are missing: HOST, PORT, or DB_PASSWORD"
      );
    }

    this.serverConfigData = {
      host,
      port,
      dbEnv: {
        dbHost,
        dbPort,
        dbUserName,
        dbPassword,
      },
    };
  }
}

const serverConfiguration = new ServerConfiguration();
const serverConfigData = serverConfiguration.getEnvData();

export { serverConfigData };
