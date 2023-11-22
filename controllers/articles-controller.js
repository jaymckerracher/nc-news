
const { selectArticle, selectCommentsFromArticle } = require("../models/articles-model");

const { selectArticle, selectAllArticles } = require("../models/articles-model");

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    selectArticle(article_id)
    .then(result => {
        res.status(200).send({article: result});
    })
    .catch(next);
}

exports.getArticles = (req, res, next) => {
    selectAllArticles()
    .then(result => {
        res.status(200).send(result);
    })
    .catch(next);
}