const express = require("express");
const {
  getTopics,
  getArticleById,
  updateArticleById,
  getUsers,
} = require("./controllers/topics-controller");
const {
  handleCustomErrors,
  handlePsqlErrors,
} = require("./error-handling/errors");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/users", getUsers);

app.patch("/api/articles/:article_id", updateArticleById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Input not found" });
});

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

module.exports = app;
