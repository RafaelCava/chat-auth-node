export default {
  mongoUrl: `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin` || 'mongodb://localhost:27017/chat-auth?authSource=admin',
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379'
}