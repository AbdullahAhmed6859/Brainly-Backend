import { config } from "dotenv";
config({ path: `${__dirname}/../.env` });
console.log(process.env);
export const PORT: string = process.env.PORT as string;

const DB_PASSWORD = process.env.DATABASE_PASSWORD as string;
const DB_USERNAME = process.env.DATABASE_USERNAME as string;
export const CONNECTION_STR = (process.env.DATABASE_CONNECTION as string)
  .replace("<PASSWORD>", DB_PASSWORD)
  .replace("<USERNAME>", DB_USERNAME);
