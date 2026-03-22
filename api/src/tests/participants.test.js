const request = require('supertest');
const { app, truncateAll, signupAndGetToken, authHeader } = require('./helpers');

let token, eventId;

const validEvent = {
    code: 'EVT01', name: 'Test Event', start_date: '2026-06-01', end_date: '2026-06-02',
};
const validParticipant = {
    name: 'João Silva',
    email: 'joao@test.com',
    company: 'Test Corp',
    job_title: 'Engineer',
};

beforeEach(async () => {
    await truncateAll();
    token = await signupAndGetToken();
    const res = await request(app).post('/events').set(authHeader(token)).send(validEvent);
    eventId = res.body.id;
});

describe('Auth guard', () => {
    test('GET /events/:id/participants returns 401 without token', async () => {
        const res = await request(app).get(`/events/${eventId}/participants`);
        expect(res.status).toBe(401);
    });
});

describe('GET /events/:eventId/participants', () => {
    test('returns empty data array when no participants', async () => {
        const res = await request(app)
            .get(`/events/${eventId}/participants`)
            .set(authHeader(token));
        expect(res.status).toBe(200);
        expect(res.body.data).toEqual([]);
        expect(res.body.meta.total).toBe(0);
    });

    test('filters by name (case insensitive)', async () => {
        await request(app)
            .post(`/events/${eventId}/participants`)
            .set(authHeader(token))
            .send(validParticipant);
        await request(app)
            .post(`/events/${eventId}/participants`)
            .set(authHeader(token))
            .send({ name: 'Maria Souza', email: 'maria@test.com' });

        const res = await request(app)
            .get(`/events/${eventId}/participants?name=João`)
            .set(authHeader(token));
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].name).toBe('João Silva');
    });

    test('filters by company', async () => {
        await request(app)
            .post(`/events/${eventId}/participants`)
            .set(authHeader(token))
            .send(validParticipant);
        await request(app)
            .post(`/events/${eventId}/participants`)
            .set(authHeader(token))
            .send({ name: 'Maria Souza', email: 'maria@test.com', company: 'Other Corp' });

        const res = await request(app)
            .get(`/events/${eventId}/participants?company=test`)
            .set(authHeader(token));
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].company).toBe('Test Corp');
    });

    test('filters by status', async () => {
        await request(app)
            .post(`/events/${eventId}/participants`)
            .set(authHeader(token))
            .send(validParticipant);

        const res = await request(app)
            .get(`/events/${eventId}/participants?status=registered`)
            .set(authHeader(token));
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
    });
});

describe('POST /events/:eventId/participants', () => {
    test('creates participant with qr_code', async () => {
        const res = await request(app)
            .post(`/events/${eventId}/participants`)
            .set(authHeader(token))
            .send(validParticipant);
        expect(res.status).toBe(201);
        expect(res.body.id).toBeDefined();
        expect(res.body.name).toBe('João Silva');
        expect(res.body.status).toBe('registered');
    });

    test('returns 400 when name is missing', async () => {
        const res = await request(app)
            .post(`/events/${eventId}/participants`)
            .set(authHeader(token))
            .send({ email: 'joao@test.com' });
        expect(res.status).toBe(400);
    });

    test('returns 400 when email is missing', async () => {
        const res = await request(app)
            .post(`/events/${eventId}/participants`)
            .set(authHeader(token))
            .send({ name: 'João Silva' });
        expect(res.status).toBe(400);
    });

    test('returns 400 when email is invalid', async () => {
        const res = await request(app)
            .post(`/events/${eventId}/participants`)
            .set(authHeader(token))
            .send({ name: 'João Silva', email: 'notanemail' });
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/invalid email/i);
    });

    test('returns 400 when email is already registered for the event', async () => {
        await request(app)
            .post(`/events/${eventId}/participants`)
            .set(authHeader(token))
            .send(validParticipant);
        const res = await request(app)
            .post(`/events/${eventId}/participants`)
            .set(authHeader(token))
            .send({ ...validParticipant, name: 'João Clone' });
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/email/i);
    });
});

describe('GET /events/:eventId/participants/:id/qrcode', () => {
    test('returns a PNG for a known participant', async () => {
        const created = await request(app)
            .post(`/events/${eventId}/participants`)
            .set(authHeader(token))
            .send(validParticipant);
        const res = await request(app)
            .get(`/events/${eventId}/participants/${created.body.id}/qrcode`)
            .set(authHeader(token));
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/image\/png/);
    });

    test('returns 404 for unknown participant', async () => {
        const res = await request(app)
            .get(`/events/${eventId}/participants/00000000-0000-0000-0000-000000000000/qrcode`)
            .set(authHeader(token));
        expect(res.status).toBe(404);
    });
});

describe('GET /events/:eventId/participants/:id', () => {
    test('returns the participant', async () => {
        const created = await request(app)
            .post(`/events/${eventId}/participants`)
            .set(authHeader(token))
            .send(validParticipant);
        const res = await request(app)
            .get(`/events/${eventId}/participants/${created.body.id}`)
            .set(authHeader(token));
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(created.body.id);
    });

    test('returns 404 for unknown id', async () => {
        const res = await request(app)
            .get(`/events/${eventId}/participants/00000000-0000-0000-0000-000000000000`)
            .set(authHeader(token));
        expect(res.status).toBe(404);
    });
});

describe('DELETE /events/:eventId/participants/:id', () => {
    test('deletes the participant', async () => {
        const created = await request(app)
            .post(`/events/${eventId}/participants`)
            .set(authHeader(token))
            .send(validParticipant);
        const del = await request(app)
            .delete(`/events/${eventId}/participants/${created.body.id}`)
            .set(authHeader(token));
        expect(del.status).toBe(204);
    });
});

describe('Room capacity enforcement', () => {
    test('allows registration when room is not full', async () => {
        const room = await request(app)
            .post(`/events/${eventId}/rooms`)
            .set(authHeader(token))
            .send({ name: 'Small Room', capacity: 2 });

        const res = await request(app)
            .post(`/events/${eventId}/participants`)
            .set(authHeader(token))
            .send({ ...validParticipant, room_id: room.body.id });

        expect(res.status).toBe(201);
    });

    test('returns 400 when room is at capacity', async () => {
        const room = await request(app)
            .post(`/events/${eventId}/rooms`)
            .set(authHeader(token))
            .send({ name: 'Tiny Room', capacity: 1 });

        // Fill the room
        await request(app)
            .post(`/events/${eventId}/participants`)
            .set(authHeader(token))
            .send({ ...validParticipant, room_id: room.body.id });

        // Try to exceed capacity
        const res = await request(app)
            .post(`/events/${eventId}/participants`)
            .set(authHeader(token))
            .send({ name: 'Second Person', email: 'second@test.com', room_id: room.body.id });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/capacity/i);
    });

    test('allows registration when room has no capacity limit', async () => {
        const room = await request(app)
            .post(`/events/${eventId}/rooms`)
            .set(authHeader(token))
            .send({ name: 'Unlimited Room' }); // no capacity

        const res = await request(app)
            .post(`/events/${eventId}/participants`)
            .set(authHeader(token))
            .send({ ...validParticipant, room_id: room.body.id });

        expect(res.status).toBe(201);
    });
});

describe('Cross-event room assignment', () => {
    test('returns 400 when room_id belongs to a different event', async () => {
        // Create a second event with a room
        const eventB = await request(app).post('/events').set(authHeader(token)).send({
            code: 'EVT02', name: 'Event B', start_date: '2026-07-01', end_date: '2026-07-01',
        });
        const roomB = await request(app)
            .post(`/events/${eventB.body.id}/rooms`)
            .set(authHeader(token))
            .send({ name: 'Room B' });

        // Try to assign that room to a participant in event A
        const res = await request(app)
            .post(`/events/${eventId}/participants`)
            .set(authHeader(token))
            .send({ ...validParticipant, room_id: roomB.body.id });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/does not belong/i);
    });
});

describe('Email collision on update', () => {
    test('returns 400 when updated email is already taken by another participant', async () => {
        await request(app)
            .post(`/events/${eventId}/participants`)
            .set(authHeader(token))
            .send(validParticipant);
        const second = await request(app)
            .post(`/events/${eventId}/participants`)
            .set(authHeader(token))
            .send({ name: 'Maria Souza', email: 'maria@test.com' });

        const res = await request(app)
            .put(`/events/${eventId}/participants/${second.body.id}`)
            .set(authHeader(token))
            .send({ email: validParticipant.email });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/email/i);
    });

    test('allows updating a participant with their own current email', async () => {
        const created = await request(app)
            .post(`/events/${eventId}/participants`)
            .set(authHeader(token))
            .send(validParticipant);

        const res = await request(app)
            .put(`/events/${eventId}/participants/${created.body.id}`)
            .set(authHeader(token))
            .send({ email: validParticipant.email, name: 'João Updated' });

        expect(res.status).toBe(200);
    });
});

describe('Empty patch payload', () => {
    test('returns 400 when no valid fields are sent', async () => {
        const created = await request(app)
            .post(`/events/${eventId}/participants`)
            .set(authHeader(token))
            .send(validParticipant);

        const res = await request(app)
            .put(`/events/${eventId}/participants/${created.body.id}`)
            .set(authHeader(token))
            .send({ foo: 'bar' });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/no valid fields/i);
    });
});

describe('Multi-tenant isolation', () => {
    test('org B cannot access org A participants', async () => {
        // Create a participant under org A's event
        await request(app)
            .post(`/events/${eventId}/participants`)
            .set(authHeader(token))
            .send(validParticipant);

        // Org B signs up, creates their own event
        const tokenB = await signupAndGetToken({ orgName: 'Org B', slug: 'org-b', email: 'b@test.com' });
        const eventB = await request(app).post('/events').set(authHeader(tokenB)).send(validEvent);

        // Org B tries to list participants of org A's event
        const res = await request(app)
            .get(`/events/${eventId}/participants`)
            .set(authHeader(tokenB));
        expect(res.status).toBe(404);
    });
});

describe('POST /events/:eventId/participants/:id/checkin', () => {
    let participantId;

    beforeEach(async () => {
        const res = await request(app)
            .post(`/events/${eventId}/participants`)
            .set(authHeader(token))
            .send(validParticipant);
        participantId = res.body.id;
    });

    test('checks in a participant', async () => {
        const res = await request(app)
            .post(`/events/${eventId}/participants/${participantId}/checkin`)
            .set(authHeader(token));
        expect(res.status).toBe(200);
        expect(res.body.message).toMatch(/successful/i);
    });

    test('updates participant status to checked_in', async () => {
        await request(app)
            .post(`/events/${eventId}/participants/${participantId}/checkin`)
            .set(authHeader(token));
        const res = await request(app)
            .get(`/events/${eventId}/participants/${participantId}`)
            .set(authHeader(token));
        expect(res.body.status).toBe('checked_in');
        expect(res.body.checked_in_at).toBeDefined();
    });

    test('returns 400 when participant is already checked in', async () => {
        await request(app)
            .post(`/events/${eventId}/participants/${participantId}/checkin`)
            .set(authHeader(token));
        const res = await request(app)
            .post(`/events/${eventId}/participants/${participantId}/checkin`)
            .set(authHeader(token));
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/already/i);
    });

    test('returns 404 for unknown participant', async () => {
        const res = await request(app)
            .post(`/events/${eventId}/participants/00000000-0000-0000-0000-000000000000/checkin`)
            .set(authHeader(token));
        expect(res.status).toBe(404);
    });
});
