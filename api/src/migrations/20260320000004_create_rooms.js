exports.up = (knex) =>
  knex.schema.createTable('rooms', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    t.uuid('event_id').notNullable().references('id').inTable('events').onDelete('CASCADE')
    t.string('name').notNullable()
    t.integer('capacity')
    t.text('description')
    t.timestamps(true, true)
  })

exports.down = (knex) => knex.schema.dropTable('rooms')
