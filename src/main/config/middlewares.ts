import { Express } from 'express'
import cors from 'cors'
import { bodyParser, contentType } from '../middlewares'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors({
    origin: '*',
    allowedHeaders: '*',
    methods: '*'
  }))
  app.use(contentType)
}