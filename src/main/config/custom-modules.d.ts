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
    MONGO_URI_TEST: string;
    MONGO_DB: string;
    MONGO_USER: string;
    MONGO_PASSWORD: string;
    MONGO_HOST: string;
    MONGO_PORT: string;
    MONGO_OPTIONS: string;
    SALT_HASHER: string;
    APPLICATION_DOMAIN: string;
  }
}
