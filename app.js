const express = require('express');
const { handlePsqlErrors, handleCustomErrors, handleInvalidPath, handleServerErrors } = require('./error-handlers');
const { getArticleById } = require('./controllers/articles-controller');
const { getEndpoints } = require('./controllers/api-controller');
const { getTopics } = require(`${__dirname}/controllers/topics-controller`);

const app = express();

app.use(express.json());

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.use('*', (req, res, next) => {
    res.status(404).send({msg: 'Not Found'})
});
// error handling functions
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;