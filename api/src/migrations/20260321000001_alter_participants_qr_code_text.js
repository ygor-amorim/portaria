exports.up = (knex) =>
    knex.schema.alterTable('participants', (table) => {
        table.text('qr_code').alter();
    });

exports.down = (knex) =>
    knex.schema.alterTable('participants', (table) => {
        table.string('qr_code').alter();
    });
