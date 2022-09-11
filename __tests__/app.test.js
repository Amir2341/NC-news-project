const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("Accessing invalid path", () => {
  test("status 404 when path does not exist", () => {
    return request(app)
      .get("/topics")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Input not found");
      });
  });
});

describe("/api/topics", () => {
  test("status 200 return array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3);
      });
  });
  test("status 200 array has correct properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toEqual([
          {
            description: "The man, the Mitch, the legend",
            slug: "mitch",
          },
          {
            description: "Not dogs",
            slug: "cats",
          },
          {
            description: "what books are made of",
            slug: "paper",
          },
        ]);
      });
  });
});

describe(" GET/api/articles/:article_id", () => {
  test("status 200 return article object with correct properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
          })
        );
      });
  });
  test("status 200 return article object with updated comment_count property", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            comment_count: 11,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
          })
        );
      });
  });
  test("status 404 for id that does not exist", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No user found for article_id: 1000");
      });
  });
  test("status 400 for non-number id", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid id");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("status 200 votes updated on article", () => {
    return request(app)
      .patch("/api/articles/1")
      .expect(200)
      .send({ inc_votes: 1 })
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 101,
        });
      });
  });
  test("status 400 for non-number id", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid id");
      });
  });

  test("status 404 for id that does not exist", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No user found for article_id: 1000");
      });
  });
});

describe("/api/users", () => {
  test("status 200 return array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
      });
  });
  test("status 200 array has correct properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toEqual([
          {
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          },
          {
            username: "icellusedkars",
            name: "sam",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
          },
          {
            username: "rogersop",
            name: "paul",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
          },
          {
            username: "lurker",
            name: "do_nothing",
            avatar_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          },
        ]);
      });
  });
});

describe("GET /api/articles", () => {
  test("status 200 return article array ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(12);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        expect(articles).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              article_id: expect.any(Number),
              comment_count: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            }),
          ])
        );
      });
  });
  test("status 200 return article array with a sort_by query ", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(12);
        expect(articles).toBeSortedBy("author", { descending: true });
        expect(articles).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              article_id: expect.any(Number),
              comment_count: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            }),
          ])
        );
      });
  });
  test("status 200 return article array with a sort_by and order query ", () => {
    return request(app)
      .get("/api/articles?sort_by=author&&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(12);
        expect(articles).toBeSortedBy("author");
        expect(articles).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              article_id: expect.any(Number),
              comment_count: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            }),
          ])
        );
      });
  });
  test("status 200 return article array with a topic query", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(1);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        expect(articles).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              article_id: expect.any(Number),
              comment_count: expect.any(Number),
              title: "UNCOVERED: catspiracy to bring down democracy",
              topic: "cats",
              author: "rogersop",
              created_at: expect.any(String),
              votes: expect.any(Number),
            }),
          ])
        );
      });
  });
  test("status 200 return article array with all queries", () => {
    return request(app)
      .get("/api/articles?sort_by=author&&order=desc&&topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(11);
        expect(articles).toBeSortedBy("author", { descending: true });
        expect(articles).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              article_id: expect.any(Number),
              comment_count: expect.any(Number),
              title: expect.any(String),
              topic: "mitch",
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            }),
          ])
        );
      });
  });

  test("status 404 invalid topic query", () => {
    return request(app)
      .get("/api/articles?topic=shoes")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource not found");
      });
  });
  test("status 400 invalid sort by query", () => {
    return request(app)
      .get("/api/articles?sort_by=Invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status 400 invalid order query", () => {
    return request(app)
      .get("/api/articles?order=Invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("status 200 return comments array ", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(11);
        expect(comments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            }),
          ])
        );
      });
  });
  test("status 400 for non-number id", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid id");
      });
  });
  test("status 404 for id that does not exist", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource not found");
      });
  });
  test("status 200 for article exists but no comment", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(0);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("status 201 object added", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .expect(201)
      .send({
        username: "butter_bridge",
        body: "hi",
      })
      .then(({ body: { comment } }) => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            article_id: 3,
            body: "hi",
            author: "butter_bridge",
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test("status 400 for non-number id", () => {
    return request(app)
      .post("/api/articles/banana/comments")
      .expect(400)
      .send({ username: "butter_bridge", body: "hi" })
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid id");
      });
  });
  test("status 404 for id that does not exist", () => {
    return request(app)
      .post("/api/articles/100/comments")
      .expect(404)
      .send({
        username: "butter_bridge",
        body: "hi",
      })
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status 400 for bad comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .expect(400)
      .send({ username: "butter_bridge" })
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("status 404 for username does not exist", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .expect(404)
      .send({ username: "hi", body: "hi" })
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("DELETE  /api/comments/:comment_id", () => {
  test("status 204 comment is deleted by id", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("status 400 for non-number id", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid id");
      });
  });
  test("status 404 for id that does not exist", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource not found");
      });
  });
});
