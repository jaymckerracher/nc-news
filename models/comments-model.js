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
}