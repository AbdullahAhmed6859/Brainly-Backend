export {};

declare global {
  namespace Express {
    export interface Request {
      userId?: string;
    }
  }

  namespace NodeJS {
    export interface ProcessEnv {
      DB_PASSWORD: string;
      DB_CONNECTION_STR: string;
      DB_USERNAME: string;
      PORT: string;
      JWT_SECRET: string;
      PORT: string;
    }
  }
}
