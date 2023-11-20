const express = require('express');
const { handleServerErrors } = require('./error-handlers');
const { getArticleById } = require('./controllers/articles-controller');
const { getTopics } = require(`${__dirname}/controllers/topics-controller`);

const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

// error handling functions
app.use(handleServerErrors);

module.exports = app;