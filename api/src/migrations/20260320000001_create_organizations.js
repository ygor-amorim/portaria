exports.up = (knex) =>
  knex.schema.createTable('organizations', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    t.string('name').notNullable()
    t.string('slug').notNullable().unique()
    t.string('logo_url')
    t.timestamps(true, true)
  })

exports.down = (knex) => knex.schema.dropTable('organizations')
