exports.up = (knex) => knex.raw('CREATE EXTENSION IF NOT EXISTS unaccent');
exports.down = (knex) => knex.raw('DROP EXTENSION IF EXISTS unaccent');
