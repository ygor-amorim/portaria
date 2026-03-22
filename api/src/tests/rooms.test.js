const request = require('supertest');
const { app, truncateAll, signupAndGetToken, authHeader } = require('./helpers');

let token, eventId;

const validEvent = {
    code: 'EVT01', name: 'Test Event', start_date: '2026-06-01', end_date: '2026-06-02',
};
const validRoom = { name: 'Main Room', capacity: 200 };

beforeEach(async () => {
    await truncateAll();
    token = await signupAndGetToken();
    const res = await request(app).post('/events').set(authHeader(token)).send(validEvent);
    eventId = res.body.id;
});

describe('Auth guard', () => {
    test('GET /events/:id/rooms returns 401 without token', async () => {
        const res = await request(app).get(`/events/${eventId}/rooms`);
        expect(res.status).toBe(401);
    });
});

describe('GET /events/:eventId/rooms', () => {
    test('returns empty data array when no rooms exist', async () => {
        const res = await request(app).get(`/events/${eventId}/rooms`).set(authHeader(token));
        expect(res.status).toBe(200);
        expect(res.body.data).toEqual([]);
        expect(res.body.meta.total).toBe(0);
    });
});

describe('POST /events/:eventId/rooms', () => {
    test('creates a room', async () => {
        const res = await request(app)
            .post(`/events/${eventId}/rooms`)
            .set(authHeader(token))
            .send(validRoom);
        expect(res.status).toBe(201);
        expect(res.body.id).toBeDefined();
        expect(res.body.name).toBe('Main Room');
        expect(res.body.capacity).toBe(200);
    });

    test('creates a room without capacity (optional)', async () => {
        const res = await request(app)
            .post(`/events/${eventId}/rooms`)
            .set(authHeader(token))
            .send({ name: 'Sala Secundária' });
        expect(res.status).toBe(201);
        expect(res.body.capacity).toBeNull();
    });
});

describe('PUT /events/:eventId/rooms/:id', () => {
    test('updates the room', async () => {
        const created = await request(app)
            .post(`/events/${eventId}/rooms`)
            .set(authHeader(token))
            .send(validRoom);
        const res = await request(app)
            .put(`/events/${eventId}/rooms/${created.body.id}`)
            .set(authHeader(token))
            .send({ name: 'Updated Room', capacity: 300 });
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Updated Room');
        expect(res.body.capacity).toBe(300);
    });
});

describe('Multi-tenant isolation', () => {
    test('org B cannot access org A rooms', async () => {
        await request(app).post(`/events/${eventId}/rooms`).set(authHeader(token)).send(validRoom);

        const tokenB = await signupAndGetToken({ orgName: 'Org B', slug: 'org-b', email: 'b@test.com' });

        const res = await request(app)
            .get(`/events/${eventId}/rooms`)
            .set(authHeader(tokenB));
        expect(res.status).toBe(404);
    });
});

describe('DELETE /events/:eventId/rooms/:id', () => {
    test('deletes the room', async () => {
        const created = await request(app)
            .post(`/events/${eventId}/rooms`)
            .set(authHeader(token))
            .send(validRoom);
        const del = await request(app)
            .delete(`/events/${eventId}/rooms/${created.body.id}`)
            .set(authHeader(token));
        expect(del.status).toBe(204);
    });
});
