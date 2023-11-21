const { selectCommentsFromArticle } = require('../models/comments-model')
const { checkArticleExists } = require('../models/articles-model')

exports.getCommentsByArticle = (req, res, next) => {
    const {article_id} = req.params;

    checkArticleExists(article_id)
        .then(() => {
            return selectCommentsFromArticle(article_id)
        })
        .then(result => {
            res.status(200).send({comments: result})
        })
        .catch(next)
}