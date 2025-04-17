import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config({ type: "module" });

const pgDB = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE_NAME,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

pgDB.on("connect", () => {
  console.log("Database connected!");
});

export default pgDB;
