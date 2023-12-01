const {
    selectArticle,
    checkArticleExists,
    selectAllArticles,
    patchArticleById,
    checkValidPatch,
} = require("../models/articles-model");
const { checkValidQuery, checkValidSortBy } = require("../models/general-models");

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

    const queryPromises = [];

    

    for (let i=0; i<queryKeys.length; i++) {
        if (!req.query) Promise.resolve();
        else if (queryKeys[i] === 'topic') {
            queryPromises.push(checkValidQuery('topics', queryKeys[i], queryValues[i], 'slug')); // table field
        }
        else if (queryKeys[i] === 'author') {
            queryPromises.push(checkValidQuery('users', queryKeys[i], queryValues[i], 'username')); // table field
        }
        else if (queryKeys[i] === 'sort_by') {
            queryPromises.push(checkValidSortBy('articles', queryValues[i])); // sort by
        }
        else if (queryKeys[i] === 'order') {
            queryKeys.includes('sort_by') ? queryPromises.push(Promise.resolve()) : queryPromises.push(Promise.reject({status: 404, msg: '400: Bad Request'})); // order
        }
        else {
            queryPromises.push(checkValidQuery('articles', queryKeys[i], queryValues[i])); // non table field
        }
    }
    Promise.all(queryPromises) // checks that all queries are valid
    .then(() => {
        return selectAllArticles(req.query);
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
