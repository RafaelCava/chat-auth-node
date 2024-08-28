import express, { Express } from 'express'
import setupMiddlewares from './middlewares'
import setupRoutes from './routes'
import setupSwagger from './swagger'
import { Server } from 'http'

export const setupApp = async (): Promise<Express> => {
  const app = express()
  setupSwagger(app)
  setupMiddlewares(app)
  setupRoutes(app)
  return app
}

export const shutdownApp = async (app: Server): Promise<void> => {
  app.close()
}