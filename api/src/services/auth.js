const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (app) => {
    const usersService = require('./users')(app);

    const issueToken = (user) => jwt.sign(
        { id: user.id, name: user.name, email: user.email, organization_id: user.organization_id },
        process.env.JWT_SECRET,
        { expiresIn: '14d' }
    );

    const signup = async ({ orgName, slug, name, email, password }) => {
        if (!orgName || !slug || !name || !email || !password) {
            const err = new Error('All fields are required: orgName, slug, name, email, password');
            err.status = 400;
            throw err;
        }

        const existingOrg = await app.db('organizations').where({ slug }).first();
        if (existingOrg) {
            const err = new Error('Slug already in use');
            err.status = 400;
            throw err;
        }

        const [org] = await app.db('organizations')
            .insert({ name: orgName, slug }, ['id', 'name', 'slug']);

        const user = await usersService.create({
            organization_id: org.id,
            name,
            email,
            password,
            role: 'admin',
        });

        return { token: issueToken({ ...user, organization_id: org.id }) };
    };

    const signin = async (email, password) => {
        if (!email) {
            const err = new Error('Email is required');
            err.status = 400;
            throw err;
        }
        if (!password) {
            const err = new Error('Password is required');
            err.status = 400;
            throw err;
        }

        const user = await usersService.findOne({ email });
        if (!user) {
            const err = new Error('Invalid email or password');
            err.status = 401;
            throw err;
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            const err = new Error('Invalid email or password');
            err.status = 401;
            throw err;
        }

        return { token: issueToken(user) };
    };

    return { signup, signin };
};
