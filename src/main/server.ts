import 'module-alias/register'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { PostgresHelper } from '@/infra/db/postgres/helpers/postgres-helper'
import env from './config/env'

Promise.all([
  MongoHelper.connect(env.mongoUrl),
  PostgresHelper.connect()
]).then(async () => {
  const { setupApp } = await import('./config/app')
  const app = await setupApp()
  app.listen(env.port, () => console.log(`Server is running at http://localhost:${env.port}`))
}).catch(console.error)