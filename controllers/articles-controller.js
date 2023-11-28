const { selectArticle, checkArticleExists, selectAllArticles, patchArticleById, checkValidPatch, checkValidArticleQuery } = require("../models/articles-model");
const { checkValidQueries, checkValidQueryFields } = require("../models/general-models");
const { checkValidTopics } = require("../models/topics-models")

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    selectArticle(article_id)
    .then(result => {
        res.status(200).send({article: result});
    })
    .catch(next);
}

exports.getArticles = (req, res, next) => {
    // checkValidArticleQuery(req.query)
    checkValidQueries('articles', req.query)
        .then(() => {
            if (req.query.topic) {
                return checkValidTopics(req.query)
            }
            // if (req.query) return checkValidQueryFields('articles', req.query)
            return;
        })
        .then(() => {
            return selectAllArticles(req.query)
        })
        .then(result => {
            res.status(200).send({articles: result});
        })
        .catch(next);
}

exports.patchArticleById = (req, res, next) => {
    const {article_id} = req.params;
    const {inc_votes} = req.body;
    if (checkValidPatch(inc_votes)) {
        checkArticleExists(article_id)
            .then(() => {
                return patchArticleById(article_id, inc_votes)
            })
            .then(result => {
                res.status(200).send({article: result});
            })
            .catch(next)
    } else res.status(400).send({msg: 'Bad Request'})
}