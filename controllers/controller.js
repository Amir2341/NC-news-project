const {
  selectTopics,
  selectArticleById,
  addVotesById,
  selectUsers,
  selectAllArticles,
  selectCommentsById,
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

exports.getAllArticles = (req, res) => {
  selectAllArticles().then((articles) => {
    res.send({ articles });
  });
};

exports.getCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsById(article_id)
    .then((comments) => {
      res.send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
