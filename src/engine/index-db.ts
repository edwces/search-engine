import { Client } from "pg";
import dotenv from "dotenv";

// needs to be run in directory where .env file resides
dotenv.config();

interface Index {
  url: string;
  keyword?: string;
}

export const client = new Client({
  database: process.env.DB_NAME,
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT as string) || 5432,
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
});

export const indexToDB = async (client: Client, index: Index) => {
  const query = "INSERT INTO indexes(name, keyword) VALUES($1, $2)";
  await client.query(query, [index.url, index.keyword]);
};
