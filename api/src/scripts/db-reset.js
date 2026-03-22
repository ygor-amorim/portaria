require('dotenv').config();
const knex = require('knex');
const knexfile = require('../../knexfile');

const env = process.env.NODE_ENV || 'development';
const db = knex(knexfile[env]);

(async () => {
    await db.raw('TRUNCATE TABLE check_ins, participants, rooms, events, users, organizations CASCADE');
    console.log(`[db:reset] All tables truncated (${env})`);
    await db.destroy();
})();
