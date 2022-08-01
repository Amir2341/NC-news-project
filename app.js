const express = require("express");
const { getTopics } = require("./controllers/topics-controller");

const app = express();

app.get("/api/topics", getTopics);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Input not found" });
});

module.exports = app;
