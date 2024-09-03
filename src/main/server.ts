import "module-alias/register";
import { Server } from "http";
import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo-helper";
import { PostgresHelper } from "@/infra/db/postgres/helpers/postgres-helper";
import { RedisHelper } from "@/infra/db/redis/helpers/redis-helper";
import env from "@/main/config/env";

let server: Server;

async function gracefulShutdown() {
  if (server) {
    server.close((err) => {
      if (err) {
        process.exit(1);
      }
    });
  }

  // Disconnect from databases
  await Promise.allSettled([
    MongoHelper.disconnect().catch(),
    PostgresHelper.disconnect().catch(),
    RedisHelper.disconnect().catch(),
  ]);

  process.exit(0);
}

Promise.all([
  MongoHelper.connect(env.mongoUrl),
  PostgresHelper.connect(),
  RedisHelper.connect(env.redisUrl),
])
  .then(async () => {
    const { setupApp } = await import("./config/app");
    const app = await setupApp();
    server = app.listen(env.port, () =>
      // eslint-disable-next-line no-console
      console.log(`Server is running at http://localhost:${env.port}`),
    );
  })
  .catch(async () => {
    await Promise.allSettled([
      MongoHelper.disconnect(),
      PostgresHelper.disconnect(),
      RedisHelper.disconnect(),
    ]).catch();
    process.exit(1);
  });

// Handle termination signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
