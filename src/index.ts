import express from "express";
import { client, getWebsitesByPage } from "./engine/index-db";

const PORT = 3000;
const app = express();

app.set("views", "./templates");
app.set("view engine", "ejs");

app.get("/", (_, response) => {
  response.render("index");
});

app.get("/search", async (request, response) => {
  const { query, page } = request.query as any;
  if (!query) response.sendStatus(404);
  const websites = await getWebsitesByPage(client, page);
  response.render("search", { websites });
});

const bootstrap = async () => {
  client
    .connect()
    .then(() => {
      app.listen(PORT, () => {
        console.log("Listening on http://localhost:3000/");
      });
    })
    .catch((err) => console.log(`[DB]: error connecting to db: ${err}`));
};

process.on("SIGINT", async () => {
  client.end();
  console.log("[DB]: connection closed");
  process.exit(0);
});

bootstrap();
