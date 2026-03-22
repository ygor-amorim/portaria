const express = require('express');

module.exports = (app) => {
    const router = express.Router();
    const eventsService = require('../services/events')(app);

    // GET /events — list organization's events
    router.get('/', async (req, res, next) => {
        try {
            const page = Math.max(1, parseInt(req.query.page) || 1);
            const limit = Math.max(1, parseInt(req.query.limit) || 20);
            const result = await eventsService.findAll(req.user.organization_id, { page, limit });
            res.json(result);
        } catch (err) {
            next(err);
        }
    });

    // GET /events/:id
    router.get('/:id', async (req, res, next) => {
        try {
            const event = await eventsService.findOne(req.params.id, req.user.organization_id);
            if (!event) return res.status(404).json({ error: 'Event not found' });
            res.json(event);
        } catch (err) {
            next(err);
        }
    });

    // POST /events
    router.post('/', async (req, res, next) => {
        try {
            const event = await eventsService.create(req.body, req.user.organization_id, req.user.id);
            res.status(201).json(event);
        } catch (err) {
            next(err);
        }
    });

    // PUT /events/:id
    router.put('/:id', async (req, res, next) => {
        try {
            const event = await eventsService.update(req.params.id, req.user.organization_id, req.body);
            res.json(event);
        } catch (err) {
            next(err);
        }
    });

    // DELETE /events/:id
    router.delete('/:id', async (req, res, next) => {
        try {
            await eventsService.remove(req.params.id, req.user.organization_id);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    });

    return router;
};
