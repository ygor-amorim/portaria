const express = require('express');

module.exports = (app) => {
    const router = express.Router();
    const usersService = require('../services/users')(app);

    // GET /users — list org's users
    router.get('/', async (req, res, next) => {
        try {
            const users = await usersService.findAll(req.user.organization_id);
            res.json(users);
        } catch (err) {
            next(err);
        }
    });

    // POST /users — create a new user in the org
    router.post('/', async (req, res, next) => {
        try {
            const user = await usersService.create({
                ...req.body,
                organization_id: req.user.organization_id,
            });
            res.status(201).json(user);
        } catch (err) {
            next(err);
        }
    });

    return router;
};
