const express = require("express");
const {
  getTopics,
  getArticleById,
} = require("./controllers/topics-controller");
const {
  handleCustomErrors,
  handlePsqlErrors,
} = require("./error-handling/errors");
const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Input not found" });
});

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

module.exports = app;
