const db = require("../db/connection");

exports.checkValidQuery = (table, queryKey, queryValue, fieldName='') => {
    if (fieldName) queryKey = fieldName;
    queryValue = queryValue.split('_').join(' ');
    return db
        .query(`SELECT * FROM ${table}`)
        .then(({rows}) => {
            let validQuery = false;
            rows.forEach(row => {
                if (String(row[queryKey]) === queryValue) validQuery = true;
            })
            if (!validQuery) {
                if (!Object.keys(rows[0]).includes(queryKey)) {
                    return Promise.reject({
                        status: 400,
                        msg: "Bad Request - Invalid Query",
                    });
                } else {
                    return Promise.reject({
                        status: 404,
                        msg: 'Not Found'
                    });
                }
            }
            return Promise.resolve();
        })
}

exports.checkValidSortBy = (table, queryValue) => {
    return db
        .query(`SELECT * FROM ${table}`)
        .then(({rows}) => {
            const firstRow = rows[0];
            let validSortBy = false;
            for (const key in firstRow) {
                if (key === queryValue) validSortBy = true;
            }
            if (!validSortBy) {
                return Promise.reject({
                    status: 400,
                    msg: "Bad Request - Invalid Query",
                });
            }
            return Promise.resolve();
        })
}