const { selectAllUsers } = require('../models/users-model')

exports.getUsers = (req, res, next) => {
    selectAllUsers()
        .then(result => {
            res.status(200).send({users: result})
        })
        .catch(next)
};