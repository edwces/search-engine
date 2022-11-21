import express from "express";
import { search } from "./engine/query-engine";

const PORT = 3000;
const app = express();

app.set("views", "./templates");
app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log("Listening on http://localhost:3000/");
});

app.get("/", (_, response) => {
  response.render("index");
});

app.get("/search", (request, response) => {
  const { query } = request.params as any;
  if (!query) response.sendStatus(404);
  const results = search(query);
  // render results
});
