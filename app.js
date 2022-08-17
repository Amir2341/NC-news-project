const express = require("express");
const {
  getTopics,
  getArticleById,
  updateArticleById,
  getUsers,
  getAllArticles,
  getCommentsById,
  postCommentById,
  removeComment,
} = require("./controllers/controller");
const {
  handleCustomErrors,
  handlePsqlErrors,
} = require("./error-handling/errors");
const endpoints = require("./endpoints.json");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/users", getUsers);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.get("/api", (req, res) => res.send(endpoints));

app.patch("/api/articles/:article_id", updateArticleById);

app.post("/api/articles/:article_id/comments", postCommentById);

app.delete("/api/comments/:comment_id", removeComment);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Input not found" });
});

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

module.exports = app;
