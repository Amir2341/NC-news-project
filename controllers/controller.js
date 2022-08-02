const {
  selectTopics,
  selectArticleById,
  addVotesById,
  selectUsers,
} = require("../models/model");

exports.getTopics = (req, res) => {
  selectTopics().then((topics) => {
    res.send({ topics });
  });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((article) => {
      res.send({ article });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.updateArticleById = (req, res, next) => {
  const { article_id } = req.params;

  addVotesById(article_id, req.body)
    .then((article) => {
      res.send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res) => {
  selectUsers().then((users) => {
    res.send({ users });
  });
};
