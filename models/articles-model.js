const db = require(`${__dirname}/../db/connection`);

exports.selectArticle = (id) => {
    return db
        .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
        .then(({rows}) => {
            const article = rows[0];
            if (!article) {
                return Promise.reject({
                    status: 404,
                    msg: 'Article Not Found'
                });
            }
            return article;
        })
};

exports.checkArticleExists = (id) => {
    return db
        .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
        .then(({rows}) => {
            const article = rows[0];
            if(!article) {
                return Promise.reject({
                    status: 404,
                    msg: 'Article Not Found'
                });
            }
            return article;
        })
};

exports.selectAllArticles = (queries) => {
    let queryString = `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id`
    
    const queriesArr = [];
    if (queries) {
        for (const key in queries) {
            if(queriesArr.length) {
                queryString += `\n    AND`
            } else {
                queryString += `\n    WHERE`
            }
            queriesArr.push(queries[key]);
            queryString += ` ${key} = $${queriesArr.length}`
        }
    }

    queryString += `
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`

    return db
        .query(queryString, queriesArr)
        .then(({rows}) => {
            return rows;
        })
};

exports.checkValidPatch = (inc_votes) => {
    if (typeof inc_votes !== 'number' || !Number.isInteger(inc_votes) || inc_votes === 0) return false;
    return true;
}

exports.patchArticleById = (id, votes) => {
    return db
        .query(`
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;
        `, [votes, id])
        .then(({rows}) => {
            return rows[0];
        })
};

exports.checkValidArticleQuery = (queries) => {
    return db
        .query(`SELECT * FROM articles`)
        .then(({rows}) => {
            const firstArticle = rows[0];
            let validQuery = true;
            for (const key in queries) {
                if (!firstArticle[key]) {
                    validQuery = false;
                }
            }
            if (!validQuery) {
                return Promise.reject({
                    status: 400,
                    msg: 'Bad Request'
                })
            }
            return;
        })

}