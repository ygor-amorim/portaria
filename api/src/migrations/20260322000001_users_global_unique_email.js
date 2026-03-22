// Make email globally unique across all users (not just per-org).
// This closes the tenant-ambiguous sign-in bug: signin queries by email only,
// so two orgs sharing an email would cause one user to always get a 401.
// Future: replace with email-first sign-in flow when multi-org demand arises.
exports.up = async (knex) => {
    await knex.schema.alterTable('users', (t) => {
        t.dropUnique(['organization_id', 'email']);
        t.unique(['email']);
    });
};

exports.down = async (knex) => {
    await knex.schema.alterTable('users', (t) => {
        t.dropUnique(['email']);
        t.unique(['organization_id', 'email']);
    });
};
