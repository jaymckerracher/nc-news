const db = require(`${__dirname}/../db/connection`);

exports.selectTopics = () => {
    return db
        .query('SELECT * FROM topics;')
        .then(({rows}) => {
            return rows;
        })
}

exports.checkValidTopics = (query) => {
    const queryValues = Object.values(query);
    return db
        .query(`SELECT * FROM topics;`)
        .then(({rows}) => {
            let validTopic = false;
            rows.forEach(topic => {
                if (queryValues.includes(topic.slug)) {
                    validTopic = true;
                }
            })
            if (!validTopic) {
                return Promise.reject({
                    status: 404,
                    msg: 'Not Found'
                })
            }
            return;
        })
}