const request = require('supertest');
const { app, truncateAll, signupAndGetToken, authHeader } = require('./helpers');

let token;

const validEvent = {
    code: 'EVT01',
    name: 'Test Event',
    start_date: '2026-06-01',
    end_date: '2026-06-02',
    location: 'São Paulo',
};

beforeEach(async () => {
    await truncateAll();
    token = await signupAndGetToken();
});

describe('Auth guard', () => {
    test('GET /events returns 401 without token', async () => {
        const res = await request(app).get('/events');
        expect(res.status).toBe(401);
    });

    test('POST /events returns 401 without token', async () => {
        const res = await request(app).post('/events').send(validEvent);
        expect(res.status).toBe(401);
    });
});

describe('GET /events', () => {
    test('returns empty array when no events exist', async () => {
        const res = await request(app).get('/events').set(authHeader(token));
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    test('returns only events belonging to the authenticated org', async () => {
        await request(app).post('/events').set(authHeader(token)).send(validEvent);

        const tokenB = await signupAndGetToken({ slug: 'other-org', email: 'other@test.com' });
        const res = await request(app).get('/events').set(authHeader(tokenB));

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });
});

describe('POST /events', () => {
    test('creates event and returns it', async () => {
        const res = await request(app).post('/events').set(authHeader(token)).send(validEvent);
        expect(res.status).toBe(201);
        expect(res.body.id).toBeDefined();
        expect(res.body.code).toBe('EVT01');
        expect(res.body.name).toBe('Test Event');
    });

    test('returns 400 when name is missing', async () => {
        const res = await request(app).post('/events').set(authHeader(token)).send({
            code: 'EVT01', start_date: '2026-06-01', end_date: '2026-06-02',
        });
        expect(res.status).toBe(400);
    });

    test('returns 400 when code is missing', async () => {
        const res = await request(app).post('/events').set(authHeader(token)).send({
            name: 'Test Event', start_date: '2026-06-01', end_date: '2026-06-02',
        });
        expect(res.status).toBe(400);
    });

    test('returns 400 when code is already in use for the org', async () => {
        await request(app).post('/events').set(authHeader(token)).send(validEvent);
        const res = await request(app).post('/events').set(authHeader(token)).send({
            ...validEvent, name: 'Another Event',
        });
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/code/i);
    });
});

describe('GET /events/:id', () => {
    test('returns the event', async () => {
        const created = await request(app).post('/events').set(authHeader(token)).send(validEvent);
        const res = await request(app).get(`/events/${created.body.id}`).set(authHeader(token));
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(created.body.id);
    });

    test('returns 404 for unknown id', async () => {
        const res = await request(app)
            .get('/events/00000000-0000-0000-0000-000000000000')
            .set(authHeader(token));
        expect(res.status).toBe(404);
    });

    test('returns 404 when event belongs to another org', async () => {
        const created = await request(app).post('/events').set(authHeader(token)).send(validEvent);
        const tokenB = await signupAndGetToken({ slug: 'other-org', email: 'other@test.com' });
        const res = await request(app).get(`/events/${created.body.id}`).set(authHeader(tokenB));
        expect(res.status).toBe(404);
    });
});

describe('PUT /events/:id', () => {
    test('updates event fields', async () => {
        const created = await request(app).post('/events').set(authHeader(token)).send(validEvent);
        const res = await request(app)
            .put(`/events/${created.body.id}`)
            .set(authHeader(token))
            .send({ name: 'Updated Name' });
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Updated Name');
    });

    test('returns 404 for unknown id', async () => {
        const res = await request(app)
            .put('/events/00000000-0000-0000-0000-000000000000')
            .set(authHeader(token))
            .send({ name: 'X' });
        expect(res.status).toBe(404);
    });
});

describe('DELETE /events/:id', () => {
    test('deletes the event', async () => {
        const created = await request(app).post('/events').set(authHeader(token)).send(validEvent);
        const del = await request(app).delete(`/events/${created.body.id}`).set(authHeader(token));
        expect(del.status).toBe(204);

        const get = await request(app).get(`/events/${created.body.id}`).set(authHeader(token));
        expect(get.status).toBe(404);
    });

    test('returns 404 for unknown id', async () => {
        const res = await request(app)
            .delete('/events/00000000-0000-0000-0000-000000000000')
            .set(authHeader(token));
        expect(res.status).toBe(404);
    });
});

describe('PUT /events/:id — empty patch', () => {
    test('returns 400 when no valid fields are sent', async () => {
        const created = await request(app).post('/events').set(authHeader(token)).send(validEvent);
        const res = await request(app)
            .put(`/events/${created.body.id}`)
            .set(authHeader(token))
            .send({ foo: 'bar' });
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/no valid fields/i);
    });
});
