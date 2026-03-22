const QRCode = require('qrcode');
const { randomUUID } = require('crypto');

const { sendRegistrationConfirmation } = require('./email');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    const findAll = async (eventId, organizationId, filters = {}, { page = 1, limit = 20 } = {}) => {
        await assertEventOwnership(eventId, organizationId);
        const base = app.db('participants').where({ event_id: eventId });

        if (filters.status) base.where({ status: filters.status });
        if (filters.name) base.whereRaw('unaccent(name) ilike unaccent(?)', [`%${filters.name}%`]);
        if (filters.company) base.whereRaw('unaccent(company) ilike unaccent(?)', [`%${filters.company}%`]);

        const [{ count }] = await base.clone().count('id as count');
        const data = await base
            .select('id', 'name', 'email', 'company', 'job_title', 'phone', 'status', 'room_id', 'checked_in_at')
            .limit(limit)
            .offset((page - 1) * limit);

        return { data, meta: { total: Number(count), page, limit, pages: Math.ceil(Number(count) / limit) } };
    };

    const findOne = async (id, eventId, organizationId) => {
        await assertEventOwnership(eventId, organizationId);
        return app.db('participants')
            .where({ id, event_id: eventId })
            .select('id', 'name', 'email', 'cpf', 'company', 'job_title', 'phone', 'status', 'room_id', 'checked_in_at', 'created_at')
            .first();
    };

    const create = async (participant, eventId, organizationId) => {
        const event = await app.db('events')
            .where({ id: eventId, organization_id: organizationId })
            .first();
        if (!event) {
            const err = new Error('Event not found');
            err.status = 404;
            throw err;
        }

        if (!participant.name) {
            const err = new Error('Participant name is required');
            err.status = 400;
            throw err;
        }
        if (!participant.email) {
            const err = new Error('Participant email is required');
            err.status = 400;
            throw err;
        }
        if (!EMAIL_RE.test(participant.email)) {
            const err = new Error('Invalid email address');
            err.status = 400;
            throw err;
        }

        const existing = await app.db('participants')
            .where({ event_id: eventId, email: participant.email })
            .first();
        if (existing) {
            const err = new Error('Email already registered for this event');
            err.status = 400;
            throw err;
        }

        if (participant.room_id) {
            const room = await app.db('rooms').where({ id: participant.room_id, event_id: eventId }).first();
            if (!room) {
                const err = new Error('Room does not belong to this event');
                err.status = 400;
                throw err;
            }
            if (room.capacity !== null ){
                const { count } = await app.db('participants')
                .where({ room_id: participant.room_id })
                .count('id as count')
                .first();
                if (Number(count) >= room.capacity) {
                    const err = new Error('Room is at full capacity');
                    err.status = 400;
                    throw err;
                }
            }
        }


        const id = randomUUID();

        const [newParticipant] = await app.db('participants').insert({
            id,
            event_id: eventId,
            room_id: participant.room_id || null,
            name: participant.name,
            email: participant.email,
            cpf: participant.cpf || null,
            company: participant.company || null,
            job_title: participant.job_title || null,
            phone: participant.phone || null,
            status: 'registered',
        }, ['id', 'name', 'email', 'company', 'job_title', 'status']);

        if (process.env.NODE_ENV !== 'test') {
            try {
                await sendRegistrationConfirmation({
                    to: participant.email,
                    participantName: participant.name,
                    eventName: event.name,
                    startDate: event.start_date,
                    endDate: event.end_date,
                    eventLocation: event.location || '',
                    participantId: id,
                });
                console.log('Email sent to participant:', id);
            } catch (err) {
                console.error('Email send failed:', err);
            }
        }

        return newParticipant;
    };

    const update = async (id, eventId, organizationId, data) => {
        await assertEventOwnership(eventId, organizationId);
        const participant = await app.db('participants').where({ id, event_id: eventId }).first();
        if (!participant) {
            const err = new Error('Participant not found');
            err.status = 404;
            throw err;
        }

        if (data.email !== undefined && !EMAIL_RE.test(data.email)) {
            const err = new Error('Invalid email address');
            err.status = 400;
            throw err;
        }

        const allowed = ['name', 'email', 'company', 'job_title', 'phone', 'room_id'];
        const safeData = Object.fromEntries(
            Object.entries(data).filter(([k]) => allowed.includes(k))
        );

        if (Object.keys(safeData).length === 0) {
            const err = new Error('No valid fields provided for update');
            err.status = 400;
            throw err;
        }

        if (safeData.email) {
            const collision = await app.db('participants')
                .where({ event_id: eventId, email: safeData.email })
                .whereNot({ id })
                .first();
            if (collision) {
                const err = new Error('Email already registered for this event');
                err.status = 400;
                throw err;
            }
        }

        if (safeData.room_id) {
            const room = await app.db('rooms').where({ id: safeData.room_id, event_id: eventId }).first();
            if (!room) {
                const err = new Error('Room does not belong to this event');
                err.status = 400;
                throw err;
            }
        }

        const [updated] = await app.db('participants')
            .where({ id, event_id: eventId })
            .update(safeData, ['id', 'name', 'email', 'company', 'status']);

        return updated;
    };

    const remove = async (id, eventId, organizationId) => {
        await assertEventOwnership(eventId, organizationId);
        const participant = await app.db('participants').where({ id, event_id: eventId }).first();
        if (!participant) {
            const err = new Error('Participant not found');
            err.status = 404;
            throw err;
        }

        await app.db('participants').where({ id, event_id: eventId }).delete();
    };

    const checkin = async (id, eventId, organizationId, userId) => {
        await assertEventOwnership(eventId, organizationId);

        // Verify participant exists before entering transaction
        const exists = await app.db('participants').where({ id, event_id: eventId }).first();
        if (!exists) {
            const err = new Error('Participant not found');
            err.status = 404;
            throw err;
        }

        // Atomic check-in: conditional UPDATE + check_ins insert in one transaction.
        // The WHERE status != 'checked_in' guard prevents duplicate check-ins even
        // under concurrent requests — only one will update a row, the other gets 0 rows.
        return app.db.transaction(async (trx) => {
            const updated = await trx('participants')
                .where({ id, event_id: eventId, status: 'registered' })
                .update({ status: 'checked_in', checked_in_at: new Date() });

            if (updated === 0) {
                const err = new Error('Participant already checked in');
                err.status = 400;
                throw err;
            }

            await trx('check_ins').insert({
                participant_id: id,
                checked_in_by: userId,
                method: 'manual',
            });

            return { message: 'Check-in successful', participant_id: id };
        });
    };

    const getQrCode = async (id, eventId, organizationId) => {
        const participant = await findOne(id, eventId, organizationId);
        if (!participant) {
            const err = new Error('Participant not found');
            err.status = 404;
            throw err;
        }
        return QRCode.toBuffer(participant.id);
    };

    return { findAll, findOne, create, update, remove, checkin, getQrCode };
};
