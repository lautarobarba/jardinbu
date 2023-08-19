import "dotenv/config";

export const ENV_VAR: {
  // APP
  BACK_PORT: number;
  // REDIS
  REDIS_HOST: string;
  REDIS_PORT: number;
  // DB
  DB_ENGINE: "postgres" | "mysql";
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_LOGGING: boolean;
  // JWT Token
  JWT_SECRET: string;
  JWT_EXPIRATION_TIME: string;
} = {
  // APP
  BACK_PORT: Number(process.env.BACK_PORT ?? 3000),
  // REDIS
  REDIS_HOST: process.env.REDIS_HOST ?? "jbu_redis",
  REDIS_PORT: Number(process.env.REDIS_PORT ?? 6379),
  // DB
  DB_ENGINE:
    process.env.DB_ENGINE == "postgres" || process.env.DB_ENGINE == "mysql"
      ? process.env.DB_ENGINE
      : "postgres",
  DB_HOST: process.env.DB_HOST ?? "localhost",
  DB_PORT: Number(process.env.DB_PORT ?? 5432),
  DB_NAME: process.env.DB_NAME ?? "postgres",
  DB_USER: process.env.DB_USER ?? "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_LOGGING: Boolean(process.env.DB_LOGGING ?? true),
  // JWT Token
  JWT_SECRET: process.env.JWT_SECRET ?? "secret",
  JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME ?? "1d",
};
