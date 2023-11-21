const db = require(`${__dirname}/../db/connection`);

exports.selectArticle = (id) => {
    return db
        .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
        .then(({rows}) => {
            const article = rows[0];
            if (!article) {
                return Promise.reject({
                    status: 404,
                    msg: 'Not Found'
                });
            }
            return article;
        })
}

exports.checkArticleExists = (id) => {
    return db
        .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
        .then(({rows}) => {
            const article = rows[0];
            if(!article) {
                return Promise.reject({
                    status: 404,
                    msg: 'Not Found'
                });
            }
            return article;
        })
}