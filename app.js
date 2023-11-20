const express = require('express');
const { getTopics } = require(`${__dirname}/controllers/topics-controller`);

const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);

module.exports = app;