const {
    selectCommentsFromArticle,
    checkValidComment,
    deleteComment,
    addComment,
} = require("../models/comments-model");
const { selectArticle } = require("../models/articles-model");
const { selectUser } = require("../models/users-model");

exports.getCommentsByArticle = (req, res, next) => {
    const { article_id } = req.params;
    selectArticle(article_id)
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
        selectUser(username)
            .then(() => {
                return selectArticle(article_id);
            })
            .then(() => {
                return addComment(article_id, username, body);
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
