const router = require('express').Router();
const Users = require('./users-model.js');
const restricted = require('../auth/restricted-middleware.js');

router.get('/', restricted, (req, res) => {
    const token = req.headers.authorization

    Users.find(token)
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
});

module.exports = router;
