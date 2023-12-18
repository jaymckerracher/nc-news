const db = require(`${__dirname}/../db/connection`);

// GET
exports.selectAllArticles = (queries) => {
    // creating initial string
    let queryString = `
SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
FROM articles
LEFT JOIN comments
ON articles.article_id = comments.article_id`;
    // handling non sort_by/order queries
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
    // handling sort_by query
    if (queries.sort_by) {
        queriesArr.push(queries.sort_by);
        let validOrder = false;
        if (queries.order) {
            if (queries.order && queries.order.toLowerCase() === 'asc' || queries.order.toLowerCase() === 'desc') {
                validOrder = true;
            }
        }
        queryString += `
ORDER BY
    CASE
        WHEN $${queriesArr.length} = 'article_id' THEN articles.article_id
        WHEN $${queriesArr.length} = 'votes' THEN articles.votes
        WHEN $${queriesArr.length} = 'comment_count' THEN COUNT(comments.article_id)
        END ${validOrder ? queries.order : ''},
    CASE
        WHEN $${queriesArr.length} = 'created_at' THEN articles.created_at
        END ${validOrder ? queries.order : ''}`;
    } else {
        queryString += `
        ORDER BY articles.created_at DESC;`;
    }
    // making the query
    return db.query(queryString, queriesArr).then(({ rows }) => {
        return rows;
    })
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

// PATCH
exports.checkValidVotesObj = (inc_votes) => {
    if (
        !Number.isInteger(inc_votes) ||
        inc_votes === 0
    )
        return false;
    return true;
};

exports.updateArticle = (id, votes) => {
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
