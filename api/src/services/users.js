const bcrypt = require('bcryptjs');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = (app) => {

    const findAll = (organizationId) => {
        return app.db('users')
            .where({ organization_id: organizationId })
            .select('id', 'name', 'email', 'role', 'created_at');
    };

    const findOne = (filter) => {
        return app.db('users').where(filter).first();
    };

    // trx is optional — passed by signup to participate in its transaction
    const create = async (user, trx) => {
        const db = trx || app.db;

        if (!user.name) {
            const err = new Error('Name is required');
            err.status = 400;
            throw err;
        }
        if (!user.email) {
            const err = new Error('Email is required');
            err.status = 400;
            throw err;
        }
        if (!EMAIL_RE.test(user.email)) {
            const err = new Error('Invalid email address');
            err.status = 400;
            throw err;
        }
        if (!user.password) {
            const err = new Error('Password is required');
            err.status = 400;
            throw err;
        }
        if (user.password.length < 8) {
            const err = new Error('Password must be at least 8 characters');
            err.status = 400;
            throw err;
        }
        if (!user.organization_id) {
            const err = new Error('organization_id is required');
            err.status = 400;
            throw err;
        }

        const existing = await db('users').where({ email: user.email }).first();
        if (existing) {
            const err = new Error('Email already in use');
            err.status = 400;
            throw err;
        }

        const saltRounds = process.env.NODE_ENV === 'test' ? 1 : 10;
        const password_hash = await bcrypt.hash(user.password, saltRounds);

        const [created] = await db('users')
            .insert({
                organization_id: user.organization_id,
                name: user.name,
                email: user.email,
                password_hash,
                role: user.role || 'operator',
            }, ['id', 'name', 'email', 'role', 'organization_id']);

        return created;
    };

    return { findAll, findOne, create };
};
