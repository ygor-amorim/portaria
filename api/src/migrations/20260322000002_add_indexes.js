exports.up = (knex) =>
    knex.schema.alterTable('participants', (t) => {
        t.index('status');
        t.index('room_id');
    });

exports.down = (knex) =>
    knex.schema.alterTable('participants', (t) => {
        t.dropIndex('status');
        t.dropIndex('room_id');
    });
