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
