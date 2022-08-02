const db = require("../db/connection");

exports.selectTopics = async () => {
  const { rows: topics } = await db.query("SELECT * FROM topics;");
  return topics;
};

exports.selectArticleById = async (id) => {
  const { rows: article } = await db.query(
    "SELECT * FROM articles WHERE article_id = $1",
    [id]
  );

  if (!article[0]) {
    return Promise.reject({
      status: 404,
      msg: `No user found for article_id: ${id}`,
    });
  }
  return article[0];
};

exports.addVotesById = async (id, addedVotes) => {
  const { inc_votes } = addedVotes;

  const { rows: article } = await db.query(
    "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;",
    [id, inc_votes]
  );

  if (!article[0]) {
    return Promise.reject({
      status: 404,
      msg: `No user found for article_id: ${id}`,
    });
  }

  return article[0];
};

exports.selectUsers = async () => {
  const { rows: users } = await db.query("SELECT * FROM users;");

  return users;
};
