// express require
const express = require("express");
const cors = require("cors");

// error handlers require
const {
    handlePsqlErrors,
    handleCustomErrors,
    handleServerErrors,
} = require("./error-handlers");

// endpoints json require
const endpointsJson = require("./endpoints.json");

// controllers require
const {
    getArticles,
    getArticleById,
    patchArticleById,
} = require("./controllers/articles-controller");
const { getTopics } = require("./controllers/topics-controller");
const { getUsers } = require("./controllers/users-controller");
const {
    getCommentsByArticle,
    postCommentByArticle,
    deleteCommentById,
} = require("./controllers/comments-controller");

// ----------

const app = express();

app.use(cors());

app.use(express.json());

// api
app.get("/api", (req, res) => {
    res.status(200).send(endpointsJson);
});

// articles
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

// articles (comments)
app.get("/api/articles/:article_id/comments", getCommentsByArticle);
app.post("/api/articles/:article_id/comments", postCommentByArticle);

// topics
app.get("/api/topics", getTopics);

// users
app.get("/api/users", getUsers);

// comments
app.delete("/api/comments/:comment_id", deleteCommentById);

// invalid path (catch all)
app.use("*", (req, res) => {
    res.status(404).send({ msg: "Not Found" });
});

// error handling functions
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
