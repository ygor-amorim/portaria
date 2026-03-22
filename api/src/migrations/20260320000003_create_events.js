exports.up = (knex) =>
  knex.schema.createTable('events', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    t.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE')
    t.uuid('created_by').notNullable().references('id').inTable('users')
    t.string('code').notNullable()          // e.g. PORT25, TECH2026
    t.string('name').notNullable()
    t.text('description')
    t.date('start_date').notNullable()
    t.date('end_date').notNullable()
    t.string('location')
    t.string('logo_url')
    t.timestamps(true, true)
    t.unique(['organization_id', 'code'])
  })

exports.down = (knex) => knex.schema.dropTable('events')
