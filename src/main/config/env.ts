/* eslint-disable no-constant-binary-expression */
export default {
  mongoUrl:
    process.env.MONGO_URI ||
    "mongodb://localhost:27017/chat-auth?authSource=admin",
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "development",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  jwtSecret: process.env.JWT_SECRET || "secret",
  jwtIssuer: process.env.JWT_ISSUER || "issuer",
  saltHasher: Number(process.env.SALT_HASHER) || 11,
  applicationDomain: process.env.APPLICATION_DOMAIN,
  mongoUrlTest: process.env.MONGO_URI_TEST || "mongodb://localhost:27017",
};
