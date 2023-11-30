const {
    selectArticle,
    checkArticleExists,
    selectAllArticles,
    patchArticleById,
    checkValidPatch,
    checkValidArticleQueryValue,
} = require("../models/articles-model");
const { checkValidQueryParam } = require("../models/general-models");

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticle(article_id)
        .then((result) => {
            res.status(200).send({ article: result });
        })
        .catch(next);
};

exports.getArticles = (req, res, next) => {
    const queryKeys = Object.keys(req.query);
    const queryValues = Object.values(req.query);

    const queryKeyPromises = [];
    const queryValuePromises = [];

    queryKeys.forEach((key) => {
        queryKeyPromises.push(checkValidQueryParam("articles", key));
    });
    Promise.all(queryKeyPromises) // ensures that the query parameter is valid e.g. topic, author, body, sort_by.
        .then(() => {
            for (let i = 0; i < queryKeyPromises.length; i++) {
                queryValuePromises.push(
                    checkValidArticleQueryValue(queryKeys[i], queryValues[i])
                );
            }
            return Promise.all(queryValuePromises); // searches topics or users table to ensure query value is correct e.g. topic=paper is valid, topic=apple is not.
        })
        .then(() => {
            return selectAllArticles(req.query); // if queries are valid, then run the query
        })
        .then((result) => {
            res.status(200).send({ articles: result });
        })
        .catch(next);
};

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    if (checkValidPatch(inc_votes)) {
        checkArticleExists(article_id)
            .then(() => {
                return patchArticleById(article_id, inc_votes);
            })
            .then((result) => {
                res.status(200).send({ article: result });
            })
            .catch(next);
    } else res.status(400).send({ msg: "Bad Request" });
};
