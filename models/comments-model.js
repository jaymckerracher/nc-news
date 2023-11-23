const db = require(`${__dirname}/../db/connection`);

exports.selectCommentsFromArticle = (id) => {
    return db
        .query(`
        SELECT *
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at;
        `, [id])
        .then(({rows}) => {
            return rows;
        })
};

exports.insertCommentIntoArticle = (id, username, body) => {
    return db
        .query(`
        INSERT INTO comments (body, author, article_id)
        VALUES ($1, $2, $3)
        RETURNING *;`, [body, username, id])
        .then(({rows}) => {
            return rows[0];
        })
}

exports.checkValidComment = (username, body) => {
    if (typeof username !== 'string' || username.length < 1 || typeof body !== 'string' || body.length < 1) return false;
    return true;
}

exports.deleteComment = (id) => {
    return db
        .query(`
        DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *;
        `, [id])
        .then(({rows}) => {
            const deletedComment = rows[0];
            if (!deletedComment) {
                return Promise.reject({
                    status: 404,
                    msg: 'Comment Not Found'
                })
            }
            return deletedComment;
        })
}