exports.up = (knex) =>
  knex.schema.createTable('check_ins', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    t.uuid('participant_id').notNullable().references('id').inTable('participants').onDelete('CASCADE')
    t.uuid('checked_in_by').references('id').inTable('users').onDelete('SET NULL')
    t.timestamp('timestamp').notNullable().defaultTo(knex.fn.now())
    t.enu('method', ['manual', 'qr_code']).notNullable().defaultTo('manual')
  })

exports.down = (knex) => knex.schema.dropTable('check_ins')
