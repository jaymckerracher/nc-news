const db = require('../db/connection')

exports.checkValidQueries = (table, queries) => {
    return db
    .query(`SELECT * FROM ${table}`)
    .then(({rows}) => {
        const queryKeys = Object.keys(queries);
        if (queryKeys.every(key => key === 'sort_by' || key === 'order_by')) return;

        const firstRow = rows[0];
        let validQuery = true;
        for (const key in queries) {
            if (!firstRow[key]) validQuery = false;
        }

        if (!validQuery) {
            return Promise.reject({
                status: 400,
                msg: 'Bad Request - Invalid Query'
            })
        }

        return;
    })
}

exports.checkValidQueryFields = (table, queries) => {
    const queryValues = Object.values(queries);
    const queryKeys = Object.keys(queries)
    return db
        .query(`SELECT * FROM ${table}`)
        .then(({rows}) => {
            // check that each queryvalue is part of the rows
            // if each is part of a
            let validFields = true;
            for (let i=0; i<queryValues.length; i++) {
                const currentValue = queryValues[i];
                const currentKey = queryKeys[i];
                validFields = rows.some(row => row[currentKey] === currentValue);
            }
            if (!validFields) {
                Promise.reject({
                    status: 404,
                    msg: 'Not Found - <<<<'
                })
            }
            return;
        })
}