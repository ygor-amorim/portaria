const request = require('supertest');
const { app, truncateAll, signupAndGetToken, authHeader } = require('./helpers');

let adminToken;

beforeEach(async () => {
    await truncateAll();
    adminToken = await signupAndGetToken(); // signup always creates an admin
});

describe('Auth guard', () => {
    test('GET /users returns 401 without token', async () => {
        const res = await request(app).get('/users');
        expect(res.status).toBe(401);
    });
});

describe('Admin guard', () => {
    test('operator cannot list users', async () => {
        // Create an operator via admin
        await request(app)
            .post('/users')
            .set(authHeader(adminToken))
            .send({ name: 'Op User', email: 'op@test.com', password: 'password123' });

        // Sign in as the operator
        const signinRes = await request(app).post('/auth/signin').send({
            email: 'op@test.com',
            password: 'password123',
        });
        const operatorToken = signinRes.body.token;

        const res = await request(app).get('/users').set(authHeader(operatorToken));
        expect(res.status).toBe(403);
    });

    test('operator cannot create users', async () => {
        await request(app)
            .post('/users')
            .set(authHeader(adminToken))
            .send({ name: 'Op User', email: 'op@test.com', password: 'password123' });

        const signinRes = await request(app).post('/auth/signin').send({
            email: 'op@test.com',
            password: 'password123',
        });
        const operatorToken = signinRes.body.token;

        const res = await request(app)
            .post('/users')
            .set(authHeader(operatorToken))
            .send({ name: 'New User', email: 'new@test.com', password: 'password123' });
        expect(res.status).toBe(403);
    });
});

describe('GET /users', () => {
    test('admin can list users in their org', async () => {
        const res = await request(app).get('/users').set(authHeader(adminToken));
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1); // just the admin created at signup
    });
});

describe('POST /users', () => {
    test('admin can create an operator', async () => {
        const res = await request(app)
            .post('/users')
            .set(authHeader(adminToken))
            .send({ name: 'Operator', email: 'op@test.com', password: 'password123' });
        expect(res.status).toBe(201);
        expect(res.body.email).toBe('op@test.com');
        expect(res.body.role).toBe('operator');
    });

    test('role is always operator regardless of what is sent', async () => {
        const res = await request(app)
            .post('/users')
            .set(authHeader(adminToken))
            .send({ name: 'Sneaky', email: 'sneaky@test.com', password: 'password123', role: 'admin' });
        expect(res.status).toBe(201);
        expect(res.body.role).toBe('operator');
    });

    test('returns 400 when email is missing', async () => {
        const res = await request(app)
            .post('/users')
            .set(authHeader(adminToken))
            .send({ name: 'No Email', password: 'password123' });
        expect(res.status).toBe(400);
    });

    test('returns 400 when email is invalid', async () => {
        const res = await request(app)
            .post('/users')
            .set(authHeader(adminToken))
            .send({ name: 'Bad Email', email: 'notanemail', password: 'password123' });
        expect(res.status).toBe(400);
    });
});
