const { selectTopics, selectArticleById } = require("../models/topics-model");

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
