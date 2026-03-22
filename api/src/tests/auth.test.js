const request = require('supertest');
const { app, truncateAll, testCredentials } = require('./helpers');

beforeEach(truncateAll);

describe('POST /auth/signup', () => {
    test('creates org + user and returns token', async () => {
        const res = await request(app).post('/auth/signup').send(testCredentials);
        expect(res.status).toBe(201);
        expect(res.body.token).toBeDefined();
    });

    test('returns 400 when any field is missing', async () => {
        const res = await request(app).post('/auth/signup').send({ orgName: 'Incomplete' });
        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    test('returns 400 when slug is already taken', async () => {
        await request(app).post('/auth/signup').send(testCredentials);
        const res = await request(app).post('/auth/signup').send({
            ...testCredentials,
            email: 'other@test.com',
        });
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/slug/i);
    });
});

describe('POST /auth/signin', () => {
    beforeEach(async () => {
        await request(app).post('/auth/signup').send(testCredentials);
    });

    test('returns token with valid credentials', async () => {
        const res = await request(app).post('/auth/signin').send({
            email: testCredentials.email,
            password: testCredentials.password,
        });
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    test('returns 401 with wrong password', async () => {
        const res = await request(app).post('/auth/signin').send({
            email: testCredentials.email,
            password: 'wrongpassword',
        });
        expect(res.status).toBe(401);
    });

    test('returns 401 with unknown email', async () => {
        const res = await request(app).post('/auth/signin').send({
            email: 'nobody@test.com',
            password: 'password123',
        });
        expect(res.status).toBe(401);
    });

    test('wrong password and unknown email return the same error (prevents enumeration)', async () => {
        const wrongPass = await request(app).post('/auth/signin').send({
            email: testCredentials.email,
            password: 'wrong',
        });
        const unknownEmail = await request(app).post('/auth/signin').send({
            email: 'nobody@test.com',
            password: 'password123',
        });
        expect(wrongPass.body.error).toBe(unknownEmail.body.error);
    });

    test('returns 400 when email is missing', async () => {
        const res = await request(app).post('/auth/signin').send({ password: 'password123' });
        expect(res.status).toBe(400);
    });

    test('returns 400 when password is missing', async () => {
        const res = await request(app).post('/auth/signin').send({ email: testCredentials.email });
        expect(res.status).toBe(400);
    });
});
