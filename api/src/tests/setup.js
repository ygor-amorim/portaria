require('dotenv').config();
const knex = require('knex');
const knexfile = require('../../knexfile');

module.exports = async () => {
    const db = knex(knexfile.test);
    await db.migrate.latest();
    await db.destroy();
};
