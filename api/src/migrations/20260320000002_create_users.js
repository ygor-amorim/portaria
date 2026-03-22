exports.up = (knex) =>
  knex.schema.createTable('users', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    t.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE')
    t.string('email').notNullable()
    t.string('password_hash').notNullable()
    t.string('name').notNullable()
    t.enu('role', ['admin', 'operator']).notNullable().defaultTo('operator')
    t.timestamps(true, true)
    t.unique(['organization_id', 'email'])
  })

exports.down = (knex) => knex.schema.dropTable('users')
