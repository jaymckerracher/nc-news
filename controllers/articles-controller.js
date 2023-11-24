const { selectArticle, checkArticleExists, selectAllArticles, patchArticleById, checkValidPatch, checkValidArticleQuery } = require("../models/articles-model");
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
    checkValidArticleQuery(req.query)
        .then(() => {
            if (req.query.topic) {
                return checkValidTopics(req.query)
            }
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
    //check that valid input - 400
    //check that article exists - 400 (function ready in other branch)
    //patch the article - 200
    //catch (500)
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