const { selectArticle } = require("../models/articles-model");

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    selectArticle(article_id)
    .then(result => {
        res.status(200).send({article: result});
    })
}