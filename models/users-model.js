const db = require(`${__dirname}/../db/connection`);

exports.selectUser = (username) => {
    return db
        .query('SELECT * FROM users WHERE username = $1', [username])
        .then(({rows}) => {
            const user = rows[0];
            if (!user) {
                return Promise.reject({
                    status: 404,
                    msg: 'User Not Found'
                })
            }
            return user;
        })
}

exports.selectAllUsers = () => {
    return db
        .query('SELECT * FROM users')
        .then(({rows}) => {
            return rows;
        })
}