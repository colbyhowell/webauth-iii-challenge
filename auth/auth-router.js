const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const secrets = require('../config/secret')

const Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
    let user = req.body
    const hash = bcrypt.hashSync(user.password, 10)
    user.password = hash

    Users.add(user)
        .then(newU => {
            res.status(201).json(newU)
        }).catch(err => {
            res.status(500).json({ err, message: 'user could not be created' })
        })
})

router.post('/login', (req, res) => {
    let { username, password } = req.body

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = makeToken(user)

                res.status(200).json({
                    message: `welcome ${user.username}`,
                    token: token
                })
            } else {
                res.status(401).json({ message: 'invalid login creds' })
            }
        }).catch(err => {
            res.status(500).json({ message: 'server could not be reached' })
        })
})


function makeToken(user) {
    const payload = {
        username: user.username,
        userID: user.id,
        department: user.department
    }
    const options = {
        expiresIn: '1d'
    }
    const token = jwt.sign(payload, secrets.jwtSecret, options)

    return token
}


module.exports = router;