module.exports = (app) => {
    const assertEventOwnership = async (eventId, organizationId) => {
        const event = await app.db('events')
            .where({ id: eventId, organization_id: organizationId })
            .first();
        if (!event) {
            const err = new Error('Event not found');
            err.status = 404;
            throw err;
        }
    };

    const findAll = async (eventId, organizationId) => {
        await assertEventOwnership(eventId, organizationId);
        return app.db('rooms')
            .where({ event_id: eventId })
            .select('id', 'name', 'capacity', 'description', 'created_at');
    };

    const findOne = async (id, eventId, organizationId) => {
        await assertEventOwnership(eventId, organizationId);
        return app.db('rooms').where({ id, event_id: eventId }).first();
    };

    const create = async (room, eventId, organizationId) => {
        await assertEventOwnership(eventId, organizationId);
        if (!room.name) {
            const err = new Error('Room name is required');
            err.status = 400;
            throw err;
        }

        const [newRoom] = await app.db('rooms').insert({
            event_id: eventId,
            name: room.name,
            capacity: room.capacity || null,
            description: room.description || null,
        }, ['id', 'name', 'capacity', 'description']);

        return newRoom;
    };

    const update = async (id, eventId, organizationId, data) => {
        await assertEventOwnership(eventId, organizationId);
        const room = await app.db('rooms').where({ id, event_id: eventId }).first();
        if (!room) {
            const err = new Error('Room not found');
            err.status = 404;
            throw err;
        }

        const allowed = ['name', 'capacity', 'description'];
        const safeData = Object.fromEntries(
            Object.entries(data).filter(([k]) => allowed.includes(k))
        );

        if (Object.keys(safeData).length === 0) {
            const err = new Error('No valid fields provided for update');
            err.status = 400;
            throw err;
        }

        const [updated] = await app.db('rooms')
            .where({ id, event_id: eventId })
            .update(safeData, ['id', 'name', 'capacity', 'description']);

        return updated;
    };

    const remove = async (id, eventId, organizationId) => {
        await assertEventOwnership(eventId, organizationId);
        const room = await app.db('rooms').where({ id, event_id: eventId }).first();
        if (!room) {
            const err = new Error('Room not found');
            err.status = 404;
            throw err;
        }

        await app.db('rooms').where({ id, event_id: eventId }).delete();
    };

    return { findAll, findOne, create, update, remove };
};
