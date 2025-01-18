// import { config } from "dotenv";
require("dotenv").config({ path: `${__dirname}/../.env` });

const { DB_CONNECTION_STR, DB_PASSWORD, DB_USERNAME, PORT, JWT_SECRET } =
  process.env;

export const DB_CONNECTION = DB_CONNECTION_STR.replace(
  "<PASSWORD>",
  DB_PASSWORD
).replace("<USERNAME>", DB_USERNAME);

export { PORT, JWT_SECRET };
