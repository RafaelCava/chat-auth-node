import 'module-alias/register'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { PostgresHelper } from '@/infra/db/postgres/helpers/postgres-helper'
import { RedisHelper } from '@/infra/db/redis/helpers/redis-helper'
import env from '@/main/config/env'

Promise.all([
  MongoHelper.connect(env.mongoUrl),
  PostgresHelper.connect(),
  RedisHelper.connect(env.redisUrl)
]).then(async () => {
  const { setupApp } = await import('./config/app')
  const app = await setupApp()
  app.listen(env.port, () => console.log(`Server is running at http://localhost:${env.port}`))
}).catch((error) => {
  console.error(error)
  MongoHelper.disconnect()
  PostgresHelper.disconnect()
  RedisHelper.disconnect()
})