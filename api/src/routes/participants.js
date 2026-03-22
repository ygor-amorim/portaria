const express = require('express');

module.exports = (app) => {
    const router = express.Router({ mergeParams: true }); // inherit :eventId from parent
    const participantsService = require('../services/participants')(app);

    // GET /events/:eventId/participants
    router.get('/', async (req, res, next) => {
        try {
            const { status, name, company } = req.query;
            const page = Math.max(1, parseInt(req.query.page) || 1);
            const limit = Math.max(1, parseInt(req.query.limit) || 20);
            const result = await participantsService.findAll(req.params.eventId, req.user.organization_id, { status, name, company }, { page, limit });
            res.json(result);
        } catch (err) {
            next(err);
        }
    });

    // GET /events/:eventId/participants/:id
    router.get('/:id', async (req, res, next) => {
        try {
            const participant = await participantsService.findOne(req.params.id, req.params.eventId, req.user.organization_id);
            if (!participant) return res.status(404).json({ error: 'Participant not found' });
            res.json(participant);
        } catch (err) {
            next(err);
        }
    });

    // POST /events/:eventId/participants
    router.post('/', async (req, res, next) => {
        try {
            const participant = await participantsService.create(req.body, req.params.eventId, req.user.organization_id);
            res.status(201).json(participant);
        } catch (err) {
            next(err);
        }
    });

    // PUT /events/:eventId/participants/:id
    router.put('/:id', async (req, res, next) => {
        try {
            const participant = await participantsService.update(req.params.id, req.params.eventId, req.user.organization_id, req.body);
            res.json(participant);
        } catch (err) {
            next(err);
        }
    });

    // DELETE /events/:eventId/participants/:id
    router.delete('/:id', async (req, res, next) => {
        try {
            await participantsService.remove(req.params.id, req.params.eventId, req.user.organization_id);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    });

    // GET /events/:eventId/participants/:id/qrcode
    router.get('/:id/qrcode', async (req, res, next) => {
        try {
            const buffer = await participantsService.getQrCode(req.params.id, req.params.eventId, req.user.organization_id);
            res.set('Content-Type', 'image/png');
            res.send(buffer);
        } catch (err) {
            next(err);
        }
    });

    // POST /events/:eventId/participants/:id/checkin
    router.post('/:id/checkin', async (req, res, next) => {
        try {
            const result = await participantsService.checkin(req.params.id, req.params.eventId, req.user.organization_id, req.user.id);
            res.json(result);
        } catch (err) {
            next(err);
        }
    });

    return router;
};
