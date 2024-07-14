import 'module-alias/register'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { PostgresHelper } from '@/infra/db/postgres/helpers/postgres-helper'
import { RedisHelper } from '@/infra/db/redis/helpers/redis-helper'
import env from '@/main/config/env'
import { Server } from 'http'

let server: Server;

async function gracefulShutdown() {
  console.log('Starting graceful shutdown...');
  
  // Close server to stop accepting new connections
  if (server) {
    server.close((err) => {
      if (err) {
        console.error('Error while closing the server:', err);
        process.exit(1);
      } else {
        console.log('HTTP server closed.');
      }
    });
  }

  // Disconnect from databases
  try {
    await MongoHelper.disconnect();
    console.log('Disconnected from MongoDB.');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }

  try {
    await PostgresHelper.disconnect();
    console.log('Disconnected from PostgreSQL.');
  } catch (error) {
    console.error('Error disconnecting from PostgreSQL:', error);
  }

  try {
    await RedisHelper.disconnect();
    console.log('Disconnected from Redis.');
  } catch (error) {
    console.error('Error disconnecting from Redis:', error);
  }

  console.log('Graceful shutdown complete.');
  process.exit(0);
}

Promise.all([
  MongoHelper.connect(env.mongoUrl),
  PostgresHelper.connect(),
  RedisHelper.connect(env.redisUrl)
]).then(async () => {
  const { setupApp } = await import('./config/app')
  const app = await setupApp()
  server = app.listen(env.port, () => console.log(`Server is running at http://localhost:${env.port}`))
}).catch((error) => {
  console.error(error)
  MongoHelper.disconnect()
  PostgresHelper.disconnect()
  RedisHelper.disconnect()
  process.exit(1);
})

// Handle termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);