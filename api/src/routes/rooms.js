const express = require('express');

module.exports = (app) => {
    const router = express.Router({ mergeParams: true }); // inherit :eventId from parent
    const roomsService = require('../services/rooms')(app);

    // GET /events/:eventId/rooms
    router.get('/', async (req, res, next) => {
        try {
            const page = Math.max(1, parseInt(req.query.page) || 1);
            const limit = Math.max(1, parseInt(req.query.limit) || 20);
            const result = await roomsService.findAll(req.params.eventId, req.user.organization_id, { page, limit });
            res.json(result);
        } catch (err) {
            next(err);
        }
    });

    // POST /events/:eventId/rooms
    router.post('/', async (req, res, next) => {
        try {
            const room = await roomsService.create(req.body, req.params.eventId, req.user.organization_id);
            res.status(201).json(room);
        } catch (err) {
            next(err);
        }
    });

    // PUT /events/:eventId/rooms/:id
    router.put('/:id', async (req, res, next) => {
        try {
            const room = await roomsService.update(req.params.id, req.params.eventId, req.user.organization_id, req.body);
            res.json(room);
        } catch (err) {
            next(err);
        }
    });

    // DELETE /events/:eventId/rooms/:id
    router.delete('/:id', async (req, res, next) => {
        try {
            await roomsService.remove(req.params.id, req.params.eventId, req.user.organization_id);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    });

    return router;
};
