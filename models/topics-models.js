const db = require(`${__dirname}/../db/connection`);

exports.selectAllTopics = () => {
    return db
        .query('SELECT * FROM topics;')
        .then(({rows}) => {
            return rows;
        })
}