const db = require("../db/connection");

exports.checkValidQueryParam = (table, param) => {
    return db
        .query(
        `SELECT * FROM ${table}`
        )
        .then(({ rows }) => {
            const firstRow = rows[0];
            if (!firstRow[param] && param !== 'sort_by' && param !== 'order_by') {
                return Promise.reject({
                    status: 400,
                    msg: 'Bad Request - Invalid Query'
                })
            }
            return Promise.resolve();
        });
};