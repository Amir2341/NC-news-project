const {
  selectTopics,
  selectArticleById,
  addVotesById,
} = require("../models/topics-model");

exports.getTopics = (req, res, next) => {
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
