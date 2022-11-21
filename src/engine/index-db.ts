import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

interface Index {
  name: string;
  keyword: string;
}

export const client = new Client({
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT as string),
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
});

export const indexToDB = async (client: Client, index: Index) => {
  const query = "INSERT INTO indexes(name, keyword) VALUES($1, $2)";
  await client.query(query, [index.name, index.keyword]);
};
