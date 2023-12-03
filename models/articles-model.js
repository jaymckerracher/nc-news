const db = require(`${__dirname}/../db/connection`);

// GET
exports.selectAllArticles = (queries) => {
    let queryString = `
SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
FROM articles
LEFT JOIN comments
ON articles.article_id = comments.article_id`;
    const queriesArr = [];
    if (queries) {
        for (const key in queries) {
            if (key !== "sort_by" && key !== "order") {
                // adds and or where to the query string
                if (queriesArr.length) {
                    queryString += `\n    AND`;
                } else {
                    queryString += `\n    WHERE`;
                }
                if (queries[key].includes("_")) {
                    queriesArr.push(`${queries[key].split("_").join(" ")}`);
                } else {
                    queriesArr.push(queries[key]);
                }
                queryString += ` articles.${key} = $${queriesArr.length}`;
            }
        }
    }
    queryString += `
GROUP BY articles.article_id`;
    if (queries.sort_by) {
        queriesArr.push(queries.sort_by);
        queryString += `
ORDER BY
    CASE
        WHEN $${queriesArr.length} = 'votes' THEN articles.votes
    END`;
        if (queries.order) {
            queriesArr.push(queries.order);
            queryString += `
$${queriesArr.length};`;
        }
    }
    else {
        queryString += `
        ORDER BY articles.created_at DESC;`;
    }
    console.log(queryString, queriesArr, '<<<<<')
    return db.query(queryString, queriesArr).then(({ rows }) => {
        return rows;
    });
};

exports.selectArticle = (id) => {
    return db
        .query(
            `
        SELECT articles.*, COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`,
            [id]
        )
        .then(({ rows }) => {
            const article = rows[0];
            if (!article) {
                return Promise.reject({
                    status: 404,
                    msg: "Article Not Found",
                });
            }
            return article;
        });
};

exports.checkArticleExists = (id) => {
    return db
        .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
        .then(({ rows }) => {
            const article = rows[0];
            if (!article) {
                return Promise.reject({
                    status: 404,
                    msg: "Article Not Found",
                });
            }
            return article;
        });
};

// PATCH
exports.checkValidPatch = (inc_votes) => {
    if (
        typeof inc_votes !== "number" ||
        !Number.isInteger(inc_votes) ||
        inc_votes === 0
    )
        return false;
    return true;
};

exports.patchArticleById = (id, votes) => {
    return db
        .query(
            `
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;
        `,
            [votes, id]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};