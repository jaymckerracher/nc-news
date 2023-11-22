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

};

exports.selectAllArticles = () => {
    return db
        .query(`
        SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;
        `)
        .then(({rows}) => {
            return rows;

        })
}