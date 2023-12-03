const {
    selectCommentsFromArticle,
    insertCommentIntoArticle,
    checkValidComment,
    deleteComment,
} = require("../models/comments-model");
const { checkArticleExists } = require("../models/articles-model");
const { checkUserExists } = require("../models/users-model");

exports.getCommentsByArticle = (req, res, next) => {
    const { article_id } = req.params;
    checkArticleExists(article_id)
        .then(() => {
            return selectCommentsFromArticle(article_id);
        })
        .then((result) => {
            res.status(200).send({ comments: result });
        })
        .catch(next);
};

exports.postCommentByArticle = (req, res, next) => {
    const { article_id } = req.params;
    const comment_body = req.body;
    const { username, body } = comment_body;

    if (checkValidComment(username, body)) {
        checkUserExists(username)
            .then(() => {
                return checkArticleExists(article_id);
            })
            .then(() => {
                return insertCommentIntoArticle(article_id, username, body);
            })
            .then((result) => {
                res.status(201).send({ comment: result });
            })
            .catch(next);
    } else {
        res.status(400).send({ msg: "Bad Request" });
    }
};

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    deleteComment(comment_id)
        .then(() => {
            res.status(204).send();
        })
        .catch(next);
};
