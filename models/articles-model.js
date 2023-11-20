const db = require(`${__dirname}/../db/connection`);

exports.selectArticle = (id) => {
    return db
        .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
        .then(({rows}) => {
            return rows[0];
        })
}