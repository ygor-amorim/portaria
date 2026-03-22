exports.up = (knex) =>
    knex.schema.alterTable('participants', (t) => {
        t.dropColumn('qr_code');
    });

exports.down = (knex) =>
    knex.schema.alterTable('participants', (t) => {
        t.text('qr_code').unique();
    });
