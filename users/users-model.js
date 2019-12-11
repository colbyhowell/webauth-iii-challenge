const db = require('../database/db-config.js');
const jwt = require('jsonwebtoken');
const secret = require('../config/secret');

module.exports = {
    add,
    find,
    findBy,
    findById,
};

function find(token) {

    const decoded = jwt.verify(token, secret.jwtSecret)
    console.log(decoded)

    return db('users').where({ department: decoded.department })
}

function findBy(filter) {
    return db('users').where(filter);
}

async function add(user) {
    const [id] = await db('users').insert(user);

    return findById(id);
}

function findById(id) {
    return db('users')
        .where({ id })
        .first();
}
