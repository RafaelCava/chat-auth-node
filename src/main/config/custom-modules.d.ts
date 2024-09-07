declare module Express {
  interface Request {
    userId?: string;
  }
}

declare module NodeJS {
  interface ProcessEnv {
    JWT_SECRET: string;
    JWT_ISSUER: string;
    REDIS_URL: string;
    PORT: string;
    NODE_ENV: string;
    MONGO_URI: string;
    MONGO_URI_TEST: string;
    SALT_HASHER: string;
    APPLICATION_DOMAIN: string;
  }
}
