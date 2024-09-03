import { Express } from "express";
import cors from "cors";
import { bodyParser, contentType } from "../middlewares";
import env from "./env";

export default (app: Express): void => {
  app.use(bodyParser);
  app.use(
    cors({
      origin: env.applicationDomain || "*",
      allowedHeaders: "*",
      methods: "*",
    }),
  );
  app.use(contentType);
};
