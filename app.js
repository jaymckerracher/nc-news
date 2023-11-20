const express = require('express');
const { handleServerErrors } = require('./error-handlers');
const { getTopics } = require(`${__dirname}/controllers/topics-controller`);

const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);

// error handling functions
app.use(handleServerErrors);

module.exports = app;