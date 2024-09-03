import express, { Express } from "express";
import { Server } from "http";
import setupMiddlewares from "./middlewares";
import setupRoutes from "./routes";
import setupSwagger from "./swagger";

export const setupApp = async (): Promise<Express> => {
  const app = express();
  setupSwagger(app);
  setupMiddlewares(app);
  setupRoutes(app);
  return app;
};

export const shutdownApp = async (app: Server): Promise<void> => {
  app.close();
};
