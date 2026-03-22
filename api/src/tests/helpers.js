const request = require('supertest');
const app = require('../app');

const truncateAll = async () => {
    await app.db.raw(
        'TRUNCATE TABLE check_ins, participants, rooms, events, users, organizations CASCADE'
    );
};

const testCredentials = {
    orgName: 'Test Org',
    slug: 'test-org',
    name: 'Test User',
    email: 'test@test.com',
    password: 'password123',
};

const signupAndGetToken = async (overrides = {}) => {
    const res = await request(app)
        .post('/auth/signup')
        .send({ ...testCredentials, ...overrides });
    if (!res.body.token) throw new Error('signup failed: ' + JSON.stringify(res.body));
    return res.body.token;
};

const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

module.exports = { app, truncateAll, testCredentials, signupAndGetToken, authHeader };
