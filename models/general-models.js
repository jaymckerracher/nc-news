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
    return db
        .query(`SELECT * FROM ${table}`)
        .then(({rows}) => {
            const firstRow = rows[0];
            const validFields = false;
            queryValues.forEach(value => {
                if(!firstRow[value]) {
                    Promise.reject({
                        status: 404,
                        msg: 'Not Found'
                    })
                }
            })
            return;
        })
}