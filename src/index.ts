import express from "express";

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

app.get("/search", (_, response) => {
  response.sendStatus(404);
});
