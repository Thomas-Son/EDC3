const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mockingoose = require("mockingoose");
const User = require("../api/users/users.model");
const Article = require("../api/articles/articles.schema");
const articlesService = require("../api/articles/articles.service");

describe("Tester API articles", () => {
  let token;
  let adminToken;
  const USER_ID = "507f1f77bcf86cd799439011";
  const ADMIN_ID = "507f1f77bcf86cd799439012";
  const ARTICLE_ID = "507f1f77bcf86cd799439013";

  const MOCK_USER = {
    _id: USER_ID,
    name: "John Doe",
    email: "john@example.com",
    role: "member",
  };

  const MOCK_ADMIN = {
    _id: ADMIN_ID,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
  };

  const MOCK_ARTICLE_DATA = {
    title: "Mon article de test",
    content: "Contenu de l'article de test",
    status: "draft",
  };

  const MOCK_ARTICLE_CREATED = {
    _id: ARTICLE_ID,
    title: "Mon article de test",
    content: "Contenu de l'article de test",
    status: "draft",
    user: USER_ID,
    date: new Date(),
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
    adminToken = jwt.sign({ userId: ADMIN_ID }, config.secretJwtToken);

    mockingoose(User).toReturn(MOCK_USER, "findOne");
    mockingoose(Article).toReturn(MOCK_ARTICLE_CREATED, "save");
  });

  test("[Articles] Create Article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_ARTICLE_DATA)
      .set("x-access-token", token);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_ARTICLE_DATA.title);
  });

  test("[Articles] Update Article", async () => {
    mockingoose(User).toReturn(MOCK_ADMIN, "findOne");
    mockingoose(Article).toReturn(
      {
        _id: ARTICLE_ID,
        title: "Article modifié",
        content: "Contenu modifié",
        status: "published",
        user: ADMIN_ID,
      },
      "findOneAndUpdate"
    );

    const res = await request(app)
      .put(`/api/articles/${ARTICLE_ID}`)
      .send({ title: "Article modifié" })
      .set("x-access-token", adminToken);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Article modifié");
  });

  test("[Articles] Delete Article", async () => {
    mockingoose(User).toReturn(MOCK_ADMIN, "findOne");
    mockingoose(Article).toReturn(MOCK_ARTICLE_CREATED, "findOneAndDelete");

    const res = await request(app)
      .delete(`/api/articles/${ARTICLE_ID}`)
      .set("x-access-token", adminToken);

    expect(res.status).toBe(200);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    mockingoose.resetAll();
  });
});
