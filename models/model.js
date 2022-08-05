const db = require("../db/connection");
const { checkExists } = require("../utility");

exports.selectTopics = async () => {
  const { rows: topics } = await db.query("SELECT * FROM topics;");
  return topics;
};

exports.selectArticleById = async (id) => {
  const { rows: article } = await db.query(
    "SELECT articles.* , COUNT(comments.article_id)::INTEGER AS comment_count FROM comments LEFT JOIN articles ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id",
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

exports.selectAllArticles = async (
  sortBy = "created_at",
  order = "desc",
  topic
) => {
  let queryStr = `SELECT articles.article_id,articles.title,articles.topic,articles.author, articles.created_at,articles.votes, COUNT(comments.article_id)::INTEGER AS comment_count FROM comments RIGHT JOIN articles ON comments.article_id = articles.article_id  `;
  let injectArr = [];
  if (topic) {
    await checkExists("articles", "topic", topic);
    queryStr += ` WHERE topic = $1`;
    injectArr.push(topic);
  }

  queryStr += `GROUP BY articles.article_id ORDER BY ${sortBy} ${order}`;
  const { rows: articles } = await db.query(queryStr, injectArr);

  return articles;
};

exports.selectCommentsById = async (id) => {
  const { rows: comments } = await db.query(
    "SELECT * FROM comments WHERE article_id = $1",
    [id]
  );

  return comments;
};

exports.addCommentById = async (user, id) => {
  const { username, body } = user;
  const { rows: comment } = await db.query(
    "INSERT INTO comments (author, body, article_id) VALUES ($1,$2,$3)  RETURNING *;",
    [username, body, id]
  );

  return comment[0];
};

exports.deleteComment = async (id) => {
  const { rows: comment } = await db.query(
    "DELETE FROM comments WHERE comment_id = $1 RETURNING *;",
    [id]
  );
  return comment;
};
