module.exports = (app) => {
    const findAll = (organizationId) => {
        return app.db('events')
            .where({ organization_id: organizationId })
            .select('id', 'code', 'name', 'description', 'start_date', 'end_date', 'location', 'created_at');
    };

    const findOne = (id, organizationId) => {
        return app.db('events')
            .where({ id, organization_id: organizationId })
            .first();
    };

    const create = async (event, organizationId, userId) => {
        if (!event.name) {
            const err = new Error('Event name is required');
            err.status = 400;
            throw err;
        }
        if (!event.code) {
            const err = new Error('Event code is required');
            err.status = 400;
            throw err;
        }
        if (!event.start_date || !event.end_date) {
            const err = new Error('Start and end dates are required');
            err.status = 400;
            throw err;
        }

        const existing = await app.db('events')
            .where({ organization_id: organizationId, code: event.code })
            .first();
        if (existing) {
            const err = new Error('Event code already in use');
            err.status = 400;
            throw err;
        }

        const [newEvent] = await app.db('events').insert({
            organization_id: organizationId,
            created_by: userId,
            code: event.code,
            name: event.name,
            description: event.description,
            start_date: event.start_date,
            end_date: event.end_date,
            location: event.location,
            logo_url: event.logo_url,
        }, ['id', 'code', 'name', 'start_date', 'end_date', 'location']);

        return newEvent;
    };

    const update = async (id, organizationId, data) => {
        const event = await findOne(id, organizationId);
        if (!event) {
            const err = new Error('Event not found');
            err.status = 404;
            throw err;
        }

        const allowed = ['name', 'description', 'start_date', 'end_date', 'location', 'logo_url'];
        const safeData = Object.fromEntries(
            Object.entries(data).filter(([k]) => allowed.includes(k))
        );

        const [updated] = await app.db('events')
            .where({ id, organization_id: organizationId })
            .update(safeData, ['id', 'code', 'name', 'start_date', 'end_date', 'location']);

        return updated;
    };

    const remove = async (id, organizationId) => {
        const event = await findOne(id, organizationId);
        if (!event) {
            const err = new Error('Event not found');
            err.status = 404;
            throw err;
        }

        await app.db('events').where({ id, organization_id: organizationId }).delete();
    };

    return { findAll, findOne, create, update, remove };
};
